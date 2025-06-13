import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, Usuario, ApiResponse } from '../../services/auth';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registro.html',
  styleUrls: ['./registro.css']
})
export class RegistroComponent {
  formulario: FormGroup;
  errorMessage: string = '';
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.formulario = new FormGroup({
      nombre: new FormControl('', [Validators.required]),
      apellido: new FormControl('', [Validators.required]),
      correo: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      cedula: new FormControl('', [Validators.required]),
      roles_id_rol: new FormControl(null, [Validators.required])
    });
  }

  ngOnInit() {
    // Monitorear cambios en el campo roles_id_rol
    this.formulario.get('roles_id_rol')?.valueChanges.subscribe(value => {
        console.log('Valor seleccionado:', value);
        console.log('Tipo:', typeof value);
      });
  }
  registrarUsuario() {
    this.errorMessage = '';
    
    if (this.formulario.valid) {
      this.loading = true;
      const rawData = this.formulario.value;
      
      // Crear objeto que coincida con la interfaz Usuario
      const formData: Usuario = {
        nombre: rawData.nombre,
        apellido: rawData.apellido,
        correo: rawData.correo,
        cedula: rawData.cedula,
        password: rawData.password,
        roles_id_rol: Number(rawData.roles_id_rol)
      };

      console.log('Datos a enviar:', formData);
      console.log('Tipo de roles_id_rol:', typeof formData.roles_id_rol);

      if (isNaN(formData.roles_id_rol)) {
        this.errorMessage = 'El rol seleccionado no es válido';
        this.loading = false;
        return;
      }

      this.authService.registrarUsuarioAPI(formData).subscribe({
        next: (response: ApiResponse<Usuario>) => {
          console.log('Registro exitoso:', response);
          if (response.success) {
            // Mostrar mensaje de éxito si es necesario
            this.router.navigate(['/login']);
          } else {
            this.errorMessage = response.message || 'Error en el registro';
          }
          this.loading = false;
        },
        error: (error: any) => {
          console.error('Error en el registro:', error);
          this.errorMessage = error.message || 'Error al procesar la solicitud';
          this.loading = false;
          
          if (error.error?.correo) {
            this.errorMessage = 'El correo electrónico ya está registrado';
          }
        },
        complete: () => {
          this.loading = false;
        }
      });
    } else {
      this.errorMessage = 'Por favor, complete todos los campos requeridos correctamente';
      Object.keys(this.formulario.controls).forEach(key => {
        const control = this.formulario.get(key);
        if (control?.errors) {
          console.error(`Errores en ${key}:`, control.errors);
        }
      });
    }
  }
}

// Exportar también como Registro para mantener compatibilidad con las rutas existentes
export { RegistroComponent as Registro }
