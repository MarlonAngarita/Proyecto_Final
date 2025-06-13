import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, Usuario, ApiResponse } from '../services/auth';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.css'],
})
export class Perfil implements OnInit, OnDestroy {
  user: Usuario | null = null;
  fotoPerfil: string = 'https://www.w3schools.com/howto/img_avatar.png';
  modalActivo = false;
  modalCerrarSesionActivo = false;
  private userSubscription?: Subscription;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.cargarDatosUsuario();
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  private cargarDatosUsuario() {
    this.isLoading = true;
    this.userSubscription = this.authService.currentUser$.subscribe({
      next: (userData: Usuario | null) => {
        if (!userData) {
          console.log('No hay usuario autenticado');
          this.router.navigate(['/login']);
          return;
        }
        
        console.log('Datos de usuario cargados:', userData);
        this.user = userData;
        this.fotoPerfil = userData.fotoPerfil || 'https://www.w3schools.com/howto/img_avatar.png';
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al cargar datos del usuario:', error);
        this.errorMessage = 'No se pudieron cargar los datos del usuario';
        this.isLoading = false;
        this.router.navigate(['/login']);
      }
    });
  }

  actualizarPerfil() {
    if (!this.user) {
      this.errorMessage = 'No hay datos de usuario para actualizar';
      return;
    }

    this.isLoading = true;
    console.log('Actualizando perfil con datos:', this.user);

    this.authService.updateUserData(this.user).subscribe({
      next: (userData: Usuario) => {
        console.log('Perfil actualizado:', userData);
        this.user = userData;
        this.fotoPerfil = userData.fotoPerfil || this.fotoPerfil;
        this.modalActivo = false;
        this.isLoading = false;
        this.errorMessage = '';
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al actualizar perfil:', error);
        this.errorMessage = error.error?.message || 'Error al actualizar el perfil';
        this.isLoading = false;
      }
    });
  }

  cerrarSesion() {
    console.log('Cerrando sesión...');
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  abrirModalCerrarSesion() {
    this.modalCerrarSesionActivo = true;
  }

  cerrarModalCerrarSesion() {
    this.modalCerrarSesionActivo = false;
  }

  abrirModal() {
    if (!this.user) {
      this.errorMessage = 'No hay usuario activo';
      return;
    }
    this.modalActivo = true;
  }

  cerrarModal() {
    this.modalActivo = false;
    this.errorMessage = '';
  }

  cambiarFoto(event: Event) {
    if (!this.user) {
      this.errorMessage = 'No hay usuario activo';
      return;
    }

    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      this.errorMessage = 'Por favor, seleccione una imagen';
      return;
    }

    if (!this.validarArchivo(file, input)) {
      return;
    }

    this.procesarImagen(file);
  }

  private validarArchivo(file: File, input: HTMLInputElement): boolean {
    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      this.errorMessage = 'El archivo debe ser una imagen';
      input.value = '';
      return false;
    }

    // Validar tamaño del archivo (máximo 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      this.errorMessage = 'La imagen no debe superar los 5MB';
      input.value = '';
      return false;
    }

    return true;
  }

  private procesarImagen(file: File) {
    this.isLoading = true;
    const reader = new FileReader();

    reader.onload = () => {
      const base64String = reader.result as string;
      
      if (!this.user) {
        this.errorMessage = 'No hay usuario activo';
        this.isLoading = false;
        return;
      }

      const userData = {
        ...this.user,
        fotoPerfil: base64String
      };

      console.log('Actualizando foto de perfil...');
      this.authService.updateUserData(userData).subscribe({
        next: (updatedUser: Usuario) => {
          console.log('Foto de perfil actualizada exitosamente');
          this.user = updatedUser;
          this.fotoPerfil = updatedUser.fotoPerfil || this.fotoPerfil;
          this.isLoading = false;
          this.errorMessage = '';
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error al actualizar la foto de perfil:', error);
          this.errorMessage = 'Error al actualizar la foto de perfil';
          this.fotoPerfil = 'https://www.w3schools.com/howto/img_avatar.png';
          this.isLoading = false;
        }
      });
    };

    reader.onerror = (error: ProgressEvent<FileReader>) => {
      console.error('Error al leer el archivo:', error);
      this.errorMessage = 'Error al procesar la imagen';
      this.fotoPerfil = 'https://www.w3schools.com/howto/img_avatar.png';
      this.isLoading = false;
    };

    reader.readAsDataURL(file);
  }
}
