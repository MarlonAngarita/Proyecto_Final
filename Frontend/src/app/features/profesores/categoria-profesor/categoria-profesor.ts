import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-categoria-profesor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categoria-profesor.html',
  styleUrl: './categoria-profesor.css',
})
export class CategoriaProfesor {
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
      nombre: 'Módulos',
      imgSrc: 'https://img.freepik.com/vector-gratis/fondo-creativo-negocios_23-2147693122.jpg',
    },
  ];
  nuevaCategoria = { nombre: '', imgSrc: '' };

  cargarImagen(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.nuevaCategoria.imgSrc = reader.result as string;
        console.log('Imagen cargada correctamente:', this.nuevaCategoria.imgSrc); // ✅ Verificar si se guarda correctamente
      };
      reader.readAsDataURL(file);
    }
  }

  agregarCategoria() {
    console.log('Nombre de categoría:', this.nuevaCategoria.nombre);
    console.log('Imagen seleccionada:', this.nuevaCategoria.imgSrc);

    if (!this.nuevaCategoria.nombre || this.nuevaCategoria.nombre.trim() === '') {
      alert('Debe ingresar un nombre para la categoría.');
      return;
    }

    if (!this.nuevaCategoria.imgSrc || this.nuevaCategoria.imgSrc.trim() === '') {
      alert('Debe cargar una imagen.');
      return;
    }

    this.categorias.push({ ...this.nuevaCategoria });

    // Limpiar el formulario después de agregar la categoría
    this.nuevaCategoria = { nombre: '', imgSrc: '' };
  }

  eliminarCategoria(categoria: any) {
    this.categorias = this.categorias.filter((cat) => cat !== categoria);
  }

  editarCategoria(categoria: any) {
    const nuevoNombre = prompt('Ingrese el nuevo nombre de la categoría:', categoria.nombre);
    if (nuevoNombre !== null && nuevoNombre.trim() !== '') {
      categoria.nombre = nuevoNombre;
    }
  }

  modalActivo = false;
  categoriaEditada = { nombre: '', imgSrc: '' };

  abrirModal(categoria: any) {
    this.modalActivo = true;
    this.categoriaEditada = { ...categoria }; // Copia la información de la categoría seleccionada
  }

  cerrarModal() {
    this.modalActivo = false;
  }

  cambiarImagen(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.categoriaEditada.imgSrc = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  guardarEdicion() {
    if (this.categoriaEditada.nombre.trim() !== '') {
      const categoriaIndex = this.categorias.findIndex(
        (cat) => cat.nombre === this.categoriaEditada.nombre,
      );
      if (categoriaIndex !== -1) {
        this.categorias[categoriaIndex] = { ...this.categoriaEditada }; // Guarda cambios incluyendo la imagen
      }
      this.cerrarModal(); // Cierra el modal después de guardar
    }
  }
}
