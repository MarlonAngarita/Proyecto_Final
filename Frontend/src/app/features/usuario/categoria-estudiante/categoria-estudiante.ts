import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categoria-estudiante',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './categoria-estudiante.html',
  styleUrl: './categoria-estudiante.css',
})
export class CategoriaEstudiante {
  categorias = [
    {
      nombre: 'Juegos',
      imgSrc:
        'https://img.freepik.com/vector-gratis/elementos-concepto-streamer-juego-ilustrados_23-2148932487.jpg',
    },
    {
      nombre: 'Cursos',
      imgSrc:
        'https://img.freepik.com/vector-gratis/ilustracion-concepto-formacion-linea_114360-22546.jpg',
    },
    {
      nombre: 'Biblioteca',
      imgSrc: 'https://img.freepik.com/vector-gratis/gente-interior-sala-libreria_107791-29869.jpg',
    },
    {
      nombre: 'Módulos de aprendizaje',
      imgSrc: 'https://img.freepik.com/vector-gratis/fondo-creativo-negocios_23-2147693122.jpg',
    },
  ];
}
