import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface Usuario {
  id?: number;
  id_usuario?: number; // Para compatibilidad con respuestas del backend
  nombre: string;
  apellido?: string;
  correo: string;
  cedula?: string;
  password?: string;
  roles_id_rol: number;
  fotoPerfil?: string;
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
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api/v1/usuarios';
  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.verificarAutenticacion();
  }

  private get headers(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  }
  private validarSesion(userId: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${userId}/`, { headers: this.headers }).pipe(
      catchError((error) => {
        console.error('❌ Error al validar sesión:', error);
        return throwError(() => error);
      })
    );
  }

  private limpiarSesion() {
    console.log('🧹 Limpiando sesión...');
    localStorage.removeItem('usuario');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  private verificarAutenticacion() {
    console.log('� Verificando autenticación...');
    const userData = localStorage.getItem('usuario');
    
    if (!userData) {
      console.warn('⚠️ No hay datos de usuario almacenados');
      this.limpiarSesion();
      return;
    }

    try {
      const user = JSON.parse(userData);
      console.log('📋 Datos del usuario encontrados:', user);
      
      if (!user.id && !user.id_usuario) {
        console.error('❌ ID de usuario no encontrado en los datos');
        this.limpiarSesion();
        return;
      }

      if (!user.roles_id_rol) {
        console.error('❌ Rol de usuario no encontrado');
        this.limpiarSesion();
        return;
      }

      // Validar la sesión con el backend
      this.validarSesion(user.id || user.id_usuario).subscribe({
        next: (validUser) => {
          console.log('✅ Sesión válida:', validUser);
          const mergedUser = { ...user, ...validUser };
          this.updateLocalStorage(mergedUser);
          this.currentUserSubject.next(mergedUser);
        },
        error: (error) => {
          console.error('❌ Sesión inválida:', error);
          this.limpiarSesion();
        }
      });
      
    } catch (error) {
      console.error('❌ Error al procesar datos:', error);
      this.limpiarSesion();
    }
  }

  registrarUsuarioAPI(userData: Usuario): Observable<ApiResponse<Usuario>> {
    console.log('🔄 Iniciando registro de usuario:', userData);

    if (!this.validarDatosRegistro(userData)) {
      return throwError(() => new Error('Datos de registro inválidos'));
    }

    const registroData = this.prepararDatosRegistro(userData);
    console.log('📤 Enviando datos de registro:', registroData);

    return this.http.post<Usuario>(`${this.apiUrl}/`, registroData, { headers: this.headers }).pipe(
      map((response: Usuario) => ({
        success: true,
        data: response,
        message: 'Usuario registrado exitosamente'
      })),
      catchError(this.handleRegistroError)
    );
  }

  private validarDatosRegistro(userData: Usuario): boolean {
    if (!userData.nombre?.trim()) {
      console.error('❌ Nombre requerido');
      return false;
    }
    if (!userData.correo?.trim()) {
      console.error('❌ Correo requerido');
      return false;
    }
    if (!userData.password?.trim()) {
      console.error('❌ Contraseña requerida');
      return false;
    }
    if (!userData.roles_id_rol || isNaN(Number(userData.roles_id_rol))) {
      console.error('❌ Rol inválido');
      return false;
    }
    return true;
  }

  private prepararDatosRegistro(userData: Usuario) {
    return {
      nombre: userData.nombre.trim(),
      apellido: userData.apellido?.trim() || '',
      correo: userData.correo.trim(),
      cedula: userData.cedula?.trim() || '',
      password: userData.password,
      roles_id_rol: Number(userData.roles_id_rol)
    };
  }

  private handleRegistroError(error: HttpErrorResponse) {
    console.error('❌ Error en registro:', error);
    let errorMessage = 'Error al registrar usuario';
    
    if (error.status === 400) {
      errorMessage = error.error?.correo ? 
        'El correo electrónico ya está registrado' : 
        'Los datos proporcionados no son válidos';
    }

    return throwError(() => ({
      success: false,
      message: errorMessage,
      error: error.error
    }));
  }

  loginAPI(correo: string, contrasena: string): Observable<Usuario> {
    console.log('🔐 Iniciando login...');
    
    return this.http.post<Usuario>(`${this.apiUrl}/login/`, {
      correo,
      password: contrasena
    }, { headers: this.headers }).pipe(
      tap(user => {
        console.log('✅ Login exitoso');
        localStorage.setItem('usuario', JSON.stringify(user));
        this.currentUserSubject.next(user);
      }),
      catchError(this.handleError.bind(this))
    );
  }

  logout(): void {
    this.limpiarSesion();
  }

  getCurrentUser(): Usuario | null {
    return this.currentUserSubject.value;
  }

  getUserId(): number | null {
    const currentUser = this.getCurrentUser();
    console.log('🔍 Obteniendo ID de usuario:', currentUser);
    
    // Verificar tanto id como id_usuario para compatibilidad
    const userId = currentUser?.id || currentUser?.id_usuario;
    
    if (userId) {
      console.log('✅ ID de usuario encontrado:', userId);
      return Number(userId);
    }
    
    console.warn('⚠️ No se encontró ID de usuario');
    return null;
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  hasRole(roleId: number): boolean {
    const user = this.getCurrentUser();
    return user?.roles_id_rol === roleId;
  }

  private handleError(error: HttpErrorResponse) {
    console.error('❌ Error:', error);
    let errorMessage = 'Error en la operación';

    if (error.status === 401) {
      this.limpiarSesion();
      errorMessage = 'Sesión expirada o inválida';
    } else if (error.status === 400) {
      errorMessage = 'Datos inválidos';
    }

    return throwError(() => ({
      success: false,
      message: errorMessage,
      error: error.error
    }));
  }

  updateUserData(userData: Partial<Usuario>): Observable<Usuario> {
    console.log('🔄 Actualizando datos de usuario:', userData);
    const currentUser = this.getCurrentUser();
    
    if (!currentUser?.id) {
      console.error('❌ No hay usuario autenticado para actualizar');
      return throwError(() => new Error('No hay usuario autenticado'));
    }

    return this.http.put<Usuario>(
      `${this.apiUrl}/${currentUser.id}/`,
      userData,
      { headers: this.headers }
    ).pipe(
      tap(updatedUser => {
        console.log('✅ Usuario actualizado:', updatedUser);
        const mergedUser = { ...currentUser, ...updatedUser };
        localStorage.setItem('usuario', JSON.stringify(mergedUser));
        this.currentUserSubject.next(mergedUser);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('❌ Error al actualizar usuario:', error);
        let errorMessage = 'Error al actualizar el perfil';
        
        if (error.status === 400) {
          errorMessage = 'Los datos proporcionados no son válidos';
        } else if (error.status === 401) {
          errorMessage = 'No está autorizado para realizar esta operación';
          this.limpiarSesion();
        } else if (error.status === 404) {
          errorMessage = 'Usuario no encontrado';
        }
        
        return throwError(() => ({
          success: false,
          message: errorMessage,
          error: error.error
        }));
      })
    );
  }


  // Agregar nuevo método de validación de rol
  hasValidRole(expectedRole: number): boolean {
    const currentUser = this.getCurrentUser();
    console.log('🎭 Verificando rol:', { 
      esperado: expectedRole, 
      actual: currentUser?.roles_id_rol 
    });
    
    if (!currentUser) {
      console.warn('⚠️ No hay usuario para verificar rol');
      return false;
    }

    const hasRole = currentUser.roles_id_rol === expectedRole;
    console.log(hasRole ? '✅ Rol válido' : '❌ Rol inválido');
    return hasRole;
  }

  // Método mejorado para actualizar datos en localStorage
  private updateLocalStorage(userData: any) {
    try {
      localStorage.setItem('usuario', JSON.stringify(userData));
      console.log('💾 Datos actualizados en localStorage');
    } catch (error) {
      console.error('❌ Error al guardar en localStorage:', error);
    }
  }
}
