import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-detalle-curso',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './detalle-curso.html',
  styleUrls: ['./detalle-curso.css'],
})
export class DetalleCurso {
  curso: any = null;
  inscrito = false;
  progreso = 0;
  mostrarModalInscripcion = false;
  mostrarModalRetiroConfirmacion = false;
  mostrarModalRetiroExitoso = false;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    this.curso = navigation?.extras.state?.['curso'];

    if (!this.curso) {
      this.curso = {
        nombre: 'Curso no especificado',
        descripcion: 'No hay información disponible.',
        contenido: [],
      };
    }

    // Asegura que contenido siempre sea un array
    if (typeof this.curso.contenido === 'string') {
      this.curso.contenido = [this.curso.contenido]; /* Convierte string en array */
    }

    console.log('Curso recibido en Detalle:', this.curso);
  }

  inscribirse() {
    this.inscrito = true;
    this.progreso = 0;
    this.mostrarModalInscripcion = true;
    console.log('Modal Inscripción:', this.mostrarModalInscripcion);
  }

  confirmarRetiro() {
    this.mostrarModalRetiroConfirmacion = true;
    console.log('Modal Confirmar Retiro:', this.mostrarModalRetiroConfirmacion);
  }

  retirarse() {
    this.mostrarModalRetiroConfirmacion = false;
    this.mostrarModalRetiroExitoso = true;

    setTimeout(() => {
      this.inscrito = false;
      this.progreso = 0; /* Reinicia la barra de progreso */
    }, 1000); /* Espera 1 segundo para actualizar el estado de inscripción */

    console.log('Modal Retiro Exitoso activado:', this.mostrarModalRetiroExitoso);
  }

  volver() {
    this.router.navigate(['/usuario/cursos']);
  }

  cerrarModales() {
    if (this.mostrarModalRetiroExitoso) {
      this.inscrito = false; /* Se actualiza el estado de inscripción */
      this.progreso = 0; /* Se reinicia la barra de progreso */
    }

    this.mostrarModalInscripcion = false;
    this.mostrarModalRetiroConfirmacion = false;
    this.mostrarModalRetiroExitoso = false;
  }
}
