import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detalle-curso-profesor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './detalle-curso.html',
  styleUrl: './detalle-curso.css',
})
export class DetalleCursoProfesor {
  tarjetas = [
    { nombre: 'Cursos', ruta: '/profesores/cursos' },
    { nombre: 'Foros', ruta: 'profesores/foro-profesores' },
    { nombre: 'Módulos', ruta: '/profesores/modulos' },
    { nombre: 'Quiz', ruta: '/profesores/quiz' },
  ];

  constructor(private router: Router) {}

  navegar(ruta: string) {
    this.router.navigate([ruta]);
  }
}
