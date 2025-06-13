import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, of } from 'rxjs';
import { tap, catchError, map, retry, timeout } from 'rxjs/operators';

export interface Curso {
  id?: number;
  id_curso?: number;
  nombre_curso: string;
  descripcion_curso: string;
  contenido_curso: string;
  profesor: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: any;
}

@Injectable({
  providedIn: 'root'
})
export class CursosService {
  private apiUrl = 'http://127.0.0.1:8000/api/v1/cursos/';
  private cursosActualizadosSubject = new BehaviorSubject<boolean>(false);
  cursosActualizados$ = this.cursosActualizadosSubject.asObservable();

  constructor(private http: HttpClient) { }

  notificarActualizacion() {
    console.log('🔔 Notificando actualización de cursos');
    this.cursosActualizadosSubject.next(true);
  }

  resetearNotificacion() {
    console.log('🔄 Reseteando notificación de actualización');
    this.cursosActualizadosSubject.next(false);
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  obtenerCursosProfesor(profesorId: number): Observable<ApiResponse<Curso[]>> {
    console.log(`👨‍🏫 Obteniendo cursos del profesor ${profesorId}`);
    
    if (!profesorId) {
      console.error('❌ ID de profesor no proporcionado');
      return throwError(() => new Error('ID de profesor no proporcionado'));
    }
    
    return this.http.get<any[]>(`${this.apiUrl}profesor/${profesorId}/`, {
      headers: this.getHeaders()
    }).pipe(
      timeout(5000),
      retry({ count: 2, delay: 1000 }), // Reintenta 2 veces con 1 segundo de espera entre intentos
      map(response => {
        console.log('✅ Cursos recibidos:', response);
        return {
          success: true,
          data: Array.isArray(response) ? response : [response],
          message: 'Cursos obtenidos exitosamente'
        };
      }),
      catchError(error => {
        let errorMessage = 'Error al obtener los cursos';
        if (error instanceof HttpErrorResponse) {
          if (error.status === 404) {
            errorMessage = 'No se encontraron cursos para este profesor';
          } else if (error.status === 401) {
            errorMessage = 'No autorizado. Por favor, inicie sesión nuevamente';
          } else if (error.status === 0) {
            errorMessage = 'Error de conexión. Por favor, verifique su conexión a internet';
          }
        }
        console.error(`❌ Error en obtenerCursosProfesor: ${errorMessage}`, error);
        return this.manejarError(error, `obtener cursos del profesor ${profesorId}`, errorMessage);
      })
    );
  }

  obtenerCurso(id: number): Observable<ApiResponse<Curso>> {
    return this.http.get<Curso>(`${this.apiUrl}${id}/`, {
      headers: this.getHeaders()
    }).pipe(
      timeout(5000),
      retry(1),
      map(response => ({
        success: true,
        data: response,
        message: 'Curso obtenido exitosamente'
      })),
      catchError(error => this.manejarError(error, `obtener curso ${id}`))
    );
  }

  crearCurso(curso: Curso): Observable<ApiResponse<Curso>> {
    return this.http.post<Curso>(this.apiUrl, curso, {
      headers: this.getHeaders()
    }).pipe(
      tap(() => this.notificarActualizacion()),
      map(response => ({
        success: true,
        data: response,
        message: 'Curso creado exitosamente'
      })),
      catchError(error => this.manejarError(error, 'crear curso'))
    );
  }

  actualizarCurso(id: number, curso: Partial<Curso>): Observable<ApiResponse<Curso>> {
    return this.http.put<Curso>(`${this.apiUrl}${id}/`, curso, {
      headers: this.getHeaders()
    }).pipe(
      tap(() => this.notificarActualizacion()),
      map(response => ({
        success: true,
        data: response,
        message: 'Curso actualizado exitosamente'
      })),
      catchError(error => this.manejarError(error, `actualizar curso ${id}`))
    );
  }

  eliminarCurso(id: number): Observable<ApiResponse<void>> {
    console.log(`🗑️ Eliminando curso ${id}`);
    
    return this.http.delete<void>(`${this.apiUrl}${id}/`, {
      headers: this.getHeaders()
    }).pipe(
      timeout(5000),
      retry(1),
      tap(() => {
        console.log('✅ Curso eliminado exitosamente');
        this.notificarActualizacion();
      }),
      map(() => ({
        success: true,
        message: 'Curso eliminado exitosamente'
      })),
      catchError(error => this.manejarError(error, `eliminar curso ${id}`))
    );
  }

  private manejarError(error: HttpErrorResponse, operacion: string = 'operación', mensajePersonalizado?: string): Observable<never> {
    console.error(`❌ Error en ${operacion}:`, error);
    let mensajeError = mensajePersonalizado;

    if (!mensajePersonalizado) {
      if (error.status === 0) {
        mensajeError = 'Error de conexión: No se pudo conectar con el servidor. Verifique su conexión a internet y que el servidor esté en funcionamiento.';
      } else if (error.status === 404) {
        mensajeError = 'No se encontró el recurso solicitado';
      } else if (error.status === 403) {
        mensajeError = 'No tiene permisos para realizar esta operación';
      } else if (error.status === 401) {
        mensajeError = 'Sesión expirada o no autorizada';
      } else if (error.status >= 500) {
        mensajeError = `Error del servidor (${error.status})`;
      } else {
        mensajeError = error.error?.message || 'Error desconocido';
      }
    }

    return throwError(() => ({
      success: false,
      message: mensajeError,
      error: error,
      status: error.status,
      detalles: error.error
    }));
  }
}
