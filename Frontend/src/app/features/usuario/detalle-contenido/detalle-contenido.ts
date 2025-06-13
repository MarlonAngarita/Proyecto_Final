import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-detalle-contenido',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './detalle-contenido.html',
  styleUrl: './detalle-contenido.css',
})
export class DetalleContenido {
  temaSeleccionado = 'poo';
  busquedaModulo = '';

  temas = [
    { nombre: 'Programación Orientada a Objetos', value: 'poo' },
    { nombre: 'Estructuras de Datos', value: 'estructuras' },
    { nombre: 'Programación Funcional', value: 'funcional' },
  ];

  contenidos: { [key: string]: { nombre: string; biblioteca: string; modulos: string[] } } = {
    poo: {
      nombre: 'Programación Orientada a Objetos',
      biblioteca: 'Java, C#',
      modulos: ['Clases', 'Objetos', 'Herencia', 'Polimorfismo'],
    },
    estructuras: {
      nombre: 'Estructuras de Datos',
      biblioteca: 'Python, C++',
      modulos: ['Listas', 'Pilas', 'Colas', 'Árboles'],
    },
    funcional: {
      nombre: 'Programación Funcional',
      biblioteca: 'Haskell, JavaScript',
      modulos: ['Funciones puras', 'Inmutabilidad', 'Recursión'],
    },
  };

  contenido = this.contenidos[this.temaSeleccionado];
  modulosFiltrados = [...this.contenido.modulos];

  cargarDetalles() {
    this.contenido = this.contenidos[this.temaSeleccionado];
    this.modulosFiltrados = [...this.contenido.modulos];
  }

  filtrarModulos() {
    this.modulosFiltrados = this.contenido.modulos.filter((modulo: string) =>
      modulo.toLowerCase().includes(this.busquedaModulo.toLowerCase()),
    );
  }
}
