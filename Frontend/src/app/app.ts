import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from './core/navbar/navbar';
import { Footer } from './core/footer/footer';
import { Sidebar } from './core/sidebar/sidebar';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, Navbar, Footer, Sidebar, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  mostrarNavbar = true;

  constructor() {
    if (typeof window !== 'undefined') {
      const rutasConNavbar = ['/', '/inicio', '/registro', '/login', '/nosotros'];
      this.mostrarNavbar = rutasConNavbar.includes(window.location.pathname);
    }
  }
}
