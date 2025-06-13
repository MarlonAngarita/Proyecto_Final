import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css'],
})
export class Sidebar implements OnInit {
  sidebarOculto = true;
  modalCerrarSesionActivo = false;
  userRole: string = '';
  userName: string = ''; /* Variable para el nombre del usuario */
  user: any = {};
  fotoPerfil: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    if (typeof window !== 'undefined') {
      this.userRole = localStorage.getItem('userRole') || '';
      this.fotoPerfil = localStorage.getItem('fotoPerfil') || '/assets/img/kutsa-logo.png';
    }

    /* Verifica cada segundo si la foto en `localStorage` ha cambiado */
    setInterval(() => {
      const nuevaFoto = localStorage.getItem('fotoPerfil') || '/assets/img/kutsa-logo.png';
      if (this.fotoPerfil !== nuevaFoto) {
        this.fotoPerfil = nuevaFoto;
      }
    }, 1000);
  }

  actualizarFotoPerfil() {
    this.fotoPerfil = localStorage.getItem('fotoPerfil') || '/assets/img/kutsa-logo.png';
  }

  irAlPerfil() {
    this.router.navigate(['/perfil']); /* Redirige al perfil */
  }

  toggleSidebar() {
    this.sidebarOculto = !this.sidebarOculto;
  }

  navegar(ruta: string) {
    this.router.navigate([ruta]);
  }

  detenerPropagacion(event: Event) {
    event.stopPropagation();
  }

  @HostListener('document:click', ['$event'])
  cerrarSidebar(event: Event) {
    const target = event.target as HTMLElement;
    if (!this.sidebarOculto && !target.closest('.menu-toggle')) {
      this.sidebarOculto = true;
    }
  }

  // abrirModalCerrarSesion() {
  //   this.modalCerrarSesionActivo = true;
  // }

  /*cerrarModalCerrarSesion() {
    this.modalCerrarSesionActivo = false;
  }

  cerrarSesion() {
    this.modalCerrarSesionActivo = false;
    this.authService.logout();
    setTimeout(() => {
      window.location.reload();
    }, 300);
  }*/
}
