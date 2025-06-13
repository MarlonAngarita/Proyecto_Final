import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { CursosService, Curso } from '../../../services/cursos.service';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'app-cursos-profesor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cursos.html',
  styleUrls: ['./cursos.css'],
})
export class CursosProfesor implements OnInit, OnDestroy {
  modalCrearActivo = false;
  modalDetallesActivo = false;
  modalEdicionActivo = false;
  modalConfirmacionActivo = false;
  cursoSeleccionado: Curso | null = null;
  materialApoyo: File | null = null;
  errorMessage: string = '';
  isLoading: boolean = false;

  userRole: number | null = null;
  mostrarSidebar = false;
  mostrarFooter = false;

  cursosCreados: Curso[] = [];
  nuevoCurso: Omit<Curso, 'id' | 'profesor'> = {
    nombre_curso: '',
    descripcion_curso: '',
    contenido_curso: ''
  };

  private userSubscription?: Subscription;
  private cursosSubscription?: Subscription;

  // Constante para el rol de profesor
  private readonly ROLE_PROFESOR = 2;
  private initAttempts = 0;
  private maxInitAttempts = 3;
  private maxRetries = 3;
  private retryDelay = 2000; // 2 segundos
  private retryAttempts = new Map<number, number>();

  constructor(
    private router: Router,
    private authService: AuthService,
    private cursosService: CursosService
  ) {}

  ngOnInit() {
    console.log('🚀 Iniciando componente CursosProfesor...');
    this.inicializarComponente();
    this.suscribirseActualizaciones();
  }

  private inicializarComponente() {
    if (this.initAttempts >= this.maxInitAttempts) {
      console.error('❌ Máximo de intentos de inicialización alcanzado');
      this.router.navigate(['/login']);
      return;
    }

    this.initAttempts++;
    console.log(`🔄 Intento de inicialización ${this.initAttempts}/${this.maxInitAttempts}`);

    this.userSubscription = this.authService.currentUser$.subscribe({
      next: (user) => {
        if (!this.validarUsuario(user)) {
          return;
        }

        this.iniciarCargaDeCursos();
      },
      error: (error) => {
        console.error('❌ Error en la suscripción:', error);
        this.manejarError(error);
      }
    });
  }

  private validarUsuario(user: any): boolean {
    if (!user) {
      console.error('❌ Usuario no autenticado');
      this.router.navigate(['/login']);
      return false;
    }

    if (!this.authService.hasValidRole(this.ROLE_PROFESOR)) {
      console.error('❌ El usuario no tiene rol de profesor');
      this.router.navigate(['/']);
      return false;
    }

    console.log('✅ Usuario validado correctamente:', user);
    return true;
  }

  private iniciarCargaDeCursos() {
    const profesorId = this.authService.getUserId();
    
    if (!profesorId) {
      console.error('❌ No se pudo obtener el ID del profesor');
      if (this.initAttempts < this.maxInitAttempts) {
        console.log('🔄 Reintentando inicialización...');
        setTimeout(() => this.inicializarComponente(), 1000);
      }
      return;
    }

    console.log('📚 Iniciando carga de cursos para profesor:', profesorId);
    this.cargarCursos(profesorId);
  }

  // Método principal de carga de cursos
  private cargarCursos(profesorId: number) {
    this.isLoading = true;
    this.errorMessage = '';
    console.log('📚 Cargando cursos para profesor:', profesorId);

    this.cursosService.obtenerCursosProfesor(profesorId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          console.log('✅ Cursos cargados exitosamente:', response.data);
          this.cursosCreados = response.data;
        } else {
          console.warn('⚠️ Respuesta no exitosa o vacía:', response.message);
          this.cursosCreados = [];
          this.errorMessage = response.message || 'No se encontraron cursos';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Error al cargar cursos:', error);
        this.manejarError(error);
        this.cursosCreados = []; // Aseguramos que la lista esté vacía en caso de error
      }
    });
  }

  private manejarError(error: any) {
    this.isLoading = false;
    this.errorMessage = 'Error al cargar los cursos. Por favor, intente nuevamente.';
    
    if (error.status === 401) {
      console.error('❌ Error de autenticación');
      this.router.navigate(['/login']);
    } else {
      console.error('❌ Error general:', error);
    }
  }

  abrirModalCrear() {
    this.modalCrearActivo = true;
  }

  cerrarModalCrear() {
    this.modalCrearActivo = false;
  }

  // Método para crear curso actualizado
  crearCurso() {
    const profesorId = this.authService.getUserId();
    if (!profesorId) {
      console.error('❌ No se pudo obtener el ID del profesor');
      this.errorMessage = 'Error al crear el curso: ID de profesor no disponible';
      return;
    }

    if (!this.validarCamposCurso()) {
      return;
    }

    const cursoData: Curso = {
      nombre_curso: this.nuevoCurso.nombre_curso.trim(),
      descripcion_curso: this.nuevoCurso.descripcion_curso.trim(),
      contenido_curso: this.nuevoCurso.contenido_curso.trim(),
      profesor: profesorId
    };

    this.isLoading = true;
    console.log('📤 Enviando datos del curso:', cursoData);

    this.cursosService.crearCurso(cursoData).subscribe({
      next: (response) => {
        console.log('✅ Curso creado exitosamente:', response);
        this.isLoading = false;
        this.modalCrearActivo = false;
        this.modalConfirmacionActivo = true;
        this.resetearFormulario();
        // La vista se actualizará automáticamente por la suscripción
      },
      error: (error) => {
        console.error('❌ Error al crear curso:', error);
        this.isLoading = false;
        this.errorMessage = error.message || 'Error al crear el curso';
      }
    });
  }
  private validarCamposCurso(curso: any = this.nuevoCurso): boolean {
    this.errorMessage = '';
    
    if (!curso.nombre_curso?.trim()) {
      this.errorMessage = 'El nombre del curso es requerido';
      return false;
    }
    if (!curso.descripcion_curso?.trim()) {
      this.errorMessage = 'La descripción del curso es requerida';
      return false;
    }
    if (!curso.contenido_curso?.trim()) {
      this.errorMessage = 'El contenido del curso es requerido';
      return false;
    }
    return true;
  }

  private resetearFormulario() {
    this.nuevoCurso = {
      nombre_curso: '',
      descripcion_curso: '',
      contenido_curso: ''
    };
    this.materialApoyo = null;
    this.errorMessage = '';
  }

  cerrarModalConfirmacion() {
    this.modalConfirmacionActivo = false;
  }

  abrirModalDetalles(curso: any) {
    this.cursoSeleccionado = { ...curso };
    this.modalDetallesActivo = true;
  }

  cerrarModalDetalles() {
    this.modalDetallesActivo = false;
    this.cursoSeleccionado = null;
  }

  /**
   * Método seguro para obtener el ID del curso
   */
  private getCursoId(curso: any): number | null {
    const id = curso.id_curso || curso.id;
    if (!id || isNaN(Number(id))) {
      console.error('❌ ID de curso no válido:', curso);
      return null;
    }
    return Number(id);
  }

  /**
   * Método seguro para eliminar un curso con manejo mejorado de errores
   */
  eliminarCursoSeguro(curso: any) {
    console.log('🗑️ Preparando eliminación del curso:', curso);
    
    const cursoId = this.getCursoId(curso);
    if (!cursoId) {
      this.errorMessage = 'Error: No se pudo identificar el ID del curso';
      return;
    }

    const confirmMessage = `¿Estás seguro de que deseas eliminar el curso "${curso.nombre_curso}"?\nEsta acción no se puede deshacer.`;
    
    if (confirm(confirmMessage)) {
      this.isLoading = true;
      this.errorMessage = '';
      this.retryAttempts.set(cursoId, 0);
      this.intentarEliminarCurso(cursoId);
    }
  }

  private intentarEliminarCurso(cursoId: number) {
    const intentos = this.retryAttempts.get(cursoId) || 0;
    const profesorId = this.authService.getUserId();

    if (!profesorId) {
      this.handleError({
        message: 'Error: No se pudo verificar su identidad',
        status: 401
      });
      return;
    }

    console.log(`🔄 Intento ${intentos + 1}/${this.maxRetries} de eliminar curso ${cursoId}`);

    this.cursosService.eliminarCurso(cursoId).subscribe({
      next: (response) => {
        console.log('✅ Respuesta recibida:', response);
        if (response.success) {
          this.handleSuccessfulDelete(profesorId);
        } else {
          this.handleError(response);
        }
      },
      error: (error) => {
        console.error(`❌ Error en intento ${intentos + 1}:`, error);
        
        if (error.status === 0 && intentos < this.maxRetries - 1) {
          this.retryAttempts.set(cursoId, intentos + 1);
          this.handleRetry(cursoId, error);
        } else {
          this.handleError(error);
        }
      }
    });
  }

  private handleSuccessfulDelete(profesorId: number) {
    this.cargarCursos(profesorId);
    this.modalConfirmacionActivo = true;
    this.errorMessage = '';
    this.isLoading = false;
  }

  private handleRetry(cursoId: number, error: any) {
    const intentos = this.retryAttempts.get(cursoId) || 0;
    const delay = this.retryDelay * (intentos + 1); // Backoff exponencial

    this.errorMessage = 'Reintentando conexión con el servidor...';
    console.log(`🔄 Reintentando en ${delay}ms (intento ${intentos + 1})`);

    setTimeout(() => {
      if (this.isLoading) { // Verificar que aún estamos en el proceso
        this.intentarEliminarCurso(cursoId);
      }
    }, delay);
  }

  private handleError(error: any) {
    this.isLoading = false;
    console.error('❌ Error final:', error);

    if (!navigator.onLine) {
      this.errorMessage = 'No hay conexión a Internet. Por favor, verifique su conexión y vuelva a intentarlo.';
      return;
    }

    if (error.status === 0) {
      this.errorMessage = 'No se pudo conectar con el servidor. Por favor, inténtelo más tarde.';
    } else if (error.status === 401) {
      this.router.navigate(['/login']);
    } else if (error.status === 403) {
      this.errorMessage = 'No tiene permisos para realizar esta operación';
    } else {
      this.errorMessage = error.message || 'Error al eliminar el curso. Por favor, inténtelo más tarde.';
    }
  }

  editarCurso(curso: any) {
    console.log('📝 Iniciando edición del curso:', curso);
    
    if (!curso || (!curso.id && !curso.id_curso)) {
      console.error('❌ Datos del curso incompletos');
      this.errorMessage = 'Error: No se pudo identificar el curso a editar';
      return;
    }

    this.cursoSeleccionado = { ...curso };
    this.modalEdicionActivo = true;
    this.modalDetallesActivo = false;
  }

  guardarEdicionCurso() {
    console.log('💾 Intentando guardar cambios del curso');
    
    if (!this.cursoSeleccionado) {
      console.error('❌ No hay curso seleccionado para editar');
      this.errorMessage = 'Error: No hay curso seleccionado';
      return;
    }

    const cursoId = this.getCursoId(this.cursoSeleccionado);
    if (!cursoId) {
      console.error('❌ No se pudo obtener el ID del curso');
      this.errorMessage = 'Error: No se pudo identificar el curso';
      return;
    }

    const profesorId = this.authService.getUserId();
    if (!profesorId) {
      console.error('❌ No se pudo obtener el ID del profesor');
      this.errorMessage = 'Error: No se pudo verificar el profesor';
      return;
    }

    if (!this.validarCamposCurso(this.cursoSeleccionado)) {
      return;
    }

    this.isLoading = true;
    const cursoActualizado: Curso = {
      nombre_curso: this.cursoSeleccionado.nombre_curso.trim(),
      descripcion_curso: this.cursoSeleccionado.descripcion_curso.trim(),
      contenido_curso: this.cursoSeleccionado.contenido_curso.trim(),
      profesor: profesorId
    };

    this.cursosService.actualizarCurso(cursoId, cursoActualizado).subscribe({
      next: (response) => {
        if (response.success) {
          console.log('✅ Curso actualizado exitosamente:', response.data);
          this.modalEdicionActivo = false;
          this.modalConfirmacionActivo = true;
          this.cursoSeleccionado = null;
          this.errorMessage = '';
        } else {
          console.warn('⚠️ Respuesta no exitosa:', response.message);
          this.errorMessage = response.message || 'Error al actualizar el curso';
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Error al actualizar curso:', error);
        this.handleError(error);
      }
    });
  }


  cerrarModalEdicion() {
    this.modalEdicionActivo = false;
    this.cursoSeleccionado = null; // Limpiamos el curso seleccionado
  }

  cerrarTodosLosModales() {
    this.modalConfirmacionActivo = false;
    this.modalDetallesActivo = false;
    this.modalEdicionActivo = false;
    this.cursoSeleccionado = null;
  }

  agregarMaterial(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validación básica del tipo de archivo
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (allowedTypes.includes(file.type)) {
        this.materialApoyo = file;
      } else {
        console.error('Tipo de archivo no permitido. Por favor, sube un archivo PDF o Word.');
        // Limpiar el input file
        event.target.value = '';
      }
    }
  }

  private suscribirseActualizaciones() {
    console.log('👂 Suscribiéndose a actualizaciones de cursos...');
    this.cursosSubscription = this.cursosService.cursosActualizados$
      .pipe(
        filter(actualizado => actualizado)
      )
      .subscribe(() => {
        console.log('🔄 Detectada actualización de cursos');
        const profesorId = this.authService.getUserId();
        if (profesorId) {
          this.cargarCursos(profesorId);
          this.cursosService.resetearNotificacion();
        }
      });
  }

  ngOnDestroy() {
    console.log('👋 Limpiando componente CursosProfesor...');
    this.userSubscription?.unsubscribe();
    this.cursosSubscription?.unsubscribe();
  }

  private verificarConexion(): Promise<boolean> {
    return new Promise((resolve) => {
      if (navigator.onLine) {
        // Intentar hacer un ping al servidor usando la URL base
        fetch('http://127.0.0.1:8000/api/v1/ping/', { 
          method: 'HEAD',
          cache: 'no-cache'
        })
        .then(() => {
          console.log('✅ Conexión con el servidor establecida');
          resolve(true);
        })
        .catch(() => {
          console.warn('⚠️ No se pudo conectar con el servidor');
          resolve(false);
        });
      } else {
        console.warn('⚠️ No hay conexión a Internet');
        resolve(false);
      }
    });
  }

  private async intentarReconexion(): Promise<boolean> {
    console.log('🔄 Intentando reconectar...');
    let intentos = 0;
    const maxIntentos = 3;
    
    while (intentos < maxIntentos) {
      intentos++;
      console.log(`Intento ${intentos}/${maxIntentos}`);
      
      if (await this.verificarConexion()) {
        return true;
      }
      
      // Esperar antes del siguiente intento (con backoff exponencial)
      const tiempoEspera = Math.min(1000 * Math.pow(2, intentos), 10000);
      await new Promise(resolve => setTimeout(resolve, tiempoEspera));
    }
    
    return false;
  }

  // Método genérico para reintentar operaciones
  private async reintentarOperacion<T>(
    operacion: () => Promise<T>,
    mensaje: string
  ): Promise<T | null> {
    try {
      return await operacion();
    } catch (error) {
      console.error(`❌ Error en ${mensaje}:`, error);
      
      if (!navigator.onLine || (error as any)?.status === 0) {
        const reconectado = await this.intentarReconexion();
        if (reconectado) {
          try {
            return await operacion();
          } catch (retryError) {
            console.error(`❌ Error en reintento de ${mensaje}:`, retryError);
          }
        }
      }
      
      return null;
    }
  }
}
