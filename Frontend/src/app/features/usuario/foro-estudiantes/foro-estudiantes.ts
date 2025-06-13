import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-foro-estudiantes',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './foro-estudiantes.html',
  styleUrl: './foro-estudiantes.css',
})
export class ForoEstudiantes {
  tituloPost: string = '';
  contenidoPost: string = '';
  publicaciones: {
    autor: string;
    tiempo: string;
    titulo: string;
    contenido: string;
    imagen: string;
  }[] = [
    {
      autor: 'Estudiante 1',
      tiempo: 'Hace 10 min',
      titulo: 'Discusión sobre el último módulo',
      contenido: 'Me gustó el último módulo del curso, ¿qué opinan?',
      imagen:
        'https://img.freepik.com/vector-premium/avatar-personaje-dibujos-animados_24911-56974.jpg',
    },
  ];

  publicarPost() {
    if (this.tituloPost.trim() && this.contenidoPost.trim()) {
      const nuevaPublicacion = {
        autor: 'Estudiante',
        tiempo: 'Hace un momento',
        titulo: this.tituloPost.trim() /* ✅ Asegura que el título no esté vacío */,
        contenido: this.contenidoPost.trim(),
        imagen:
          'https://img.freepik.com/vector-premium/avatar-personaje-dibujos-animados_24911-56974.jpg',
      };

      console.log(
        'Nueva publicación agregada:',
        nuevaPublicacion,
      ); /* ✅ Verifica si el título se está guardando */
      this.publicaciones.unshift(nuevaPublicacion);

      this.tituloPost = '';
      this.contenidoPost = '';
    }
  }

  responderPost(post: any) {
    alert(`Respondiendo a: ${post.autor}`);
  }
}
