import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, Usuario } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  nombreUsuario = '';
  contrasenaUsuario = '';

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  onSubmit() {
    // Llama a onLogin cuando se envía el formulario
    this.onLogin();
  }

  redirigirRegistro() {
    this.router.navigate(['/registro']);
  }

  onLogin() {
    if (!this.nombreUsuario || !this.contrasenaUsuario) {
      console.error('❌ Correo y contraseña son requeridos.');
      // Aquí podrías mostrar un mensaje al usuario en la UI
      return;
    }

    this.authService.loginAPI(this.nombreUsuario, this.contrasenaUsuario).subscribe({
      next: (usuario) => {
        console.log(
          `Inicio de sesión exitoso para: ${usuario.nombre}, Rol: ${usuario.roles_id_rol}`,
        );

        // Opcional: guardar información del usuario o token si es necesario para la sesión
        // localStorage.setItem('currentUser', JSON.stringify(usuario));
        // localStorage.setItem('userRole', usuario.roles_id_rol.toString());

        // Redirección basada en el rol
        if (usuario.roles_id_rol === 2) { // Asumiendo que 2 es el rol de profesor
          this.router.navigate(['/profesores/detalle-curso']).then(() => {
            // Considera si realmente necesitas recargar la página.
            // Angular está diseñado para SPA, recargar puede no ser lo ideal.
            // window.location.reload();
          });
        } else if (usuario.roles_id_rol === 1) { // Asumiendo que 1 es el rol de usuario/estudiante
          this.router.navigate(['/usuario/cursos']).then(() => {
            // window.location.reload();
          });
        } else {
          // Rol desconocido o no especificado, redirigir a una página por defecto o mostrar error
          console.warn(`Rol no reconocido: ${usuario.roles_id_rol}. Redirigiendo a inicio.`);
          this.router.navigate(['/']); // O una ruta por defecto
        }
      },
      error: (error) => {
        console.error('❌ Error en el inicio de sesión:', error);
        // Aquí deberías mostrar un mensaje de error al usuario en la UI
        // Por ejemplo: "Credenciales incorrectas" o "Error del servidor"
        // Dependiendo del 'error' que recibas del authService.handleError
      }
    });
  }
}
