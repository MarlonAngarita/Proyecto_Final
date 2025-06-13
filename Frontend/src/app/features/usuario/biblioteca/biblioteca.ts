import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-biblioteca',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './biblioteca.html',
  styleUrl: './biblioteca.css',
})
export class Biblioteca {
  busqueda: string = '';

  biblioteca = [
    {
      titulo: 'Variables y Tipos de Datos',
      descripcion: 'Conceptos esenciales para almacenar y manejar información.',
      contenido: 'int edad = 25;',
    },
    {
      titulo: 'Estructuras de Control',
      descripcion: 'Controlan el flujo del programa.',
      contenido: 'if (x > 10) { console.log("Mayor que 10"); }',
    },
    {
      titulo: 'Bucles',
      descripcion: 'Repetición de instrucciones.',
      contenido: 'for (let i = 0; i < 5; i++) { console.log(i); }',
    },
    {
      titulo: 'Funciones',
      descripcion: 'Bloques reutilizables de código.',
      contenido: 'function suma(a, b) { return a + b; }',
    },
  ];

  get bibliotecaFiltrada() {
    return this.biblioteca.filter(
      (item) =>
        item.titulo.toLowerCase().includes(this.busqueda.toLowerCase()) ||
        item.descripcion.toLowerCase().includes(this.busqueda.toLowerCase()) ||
        item.contenido.toLowerCase().includes(this.busqueda.toLowerCase()),
    );
  }
}
