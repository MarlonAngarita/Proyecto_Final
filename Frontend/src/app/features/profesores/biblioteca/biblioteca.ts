import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-biblioteca-profesor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './biblioteca.html',
  styleUrl: './biblioteca.css',
})
export class BibliotecaProfesor implements OnInit {
  vistaActual = 'menu-principal';
  clases: any[] = [];

  nuevaClase = {
    titulo: '',
    fecha: '',
  };

  ngOnInit() {
    if (typeof window !== 'undefined') {
      this.clases = JSON.parse(localStorage.getItem('clases') || '[]');
    }
  }

  cambiarVista(vista: string) {
    this.vistaActual = vista;
  }

  guardarClase() {
    if (this.nuevaClase.titulo && this.nuevaClase.fecha) {
      this.clases.push({ ...this.nuevaClase });
      localStorage.setItem('clases', JSON.stringify(this.clases));
      this.nuevaClase = { titulo: '', fecha: '' };
      this.cambiarVista('menu-principal');
    }
  }
}
