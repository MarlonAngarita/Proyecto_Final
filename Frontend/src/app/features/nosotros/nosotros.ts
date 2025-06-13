import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nosotros',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './nosotros.html',
  styleUrls: ['./nosotros.css'],
})
export class Nosotros {
  imagenes = {
    oso: 'assets/img/Oso solo.png',
    gata: 'assets/img/gata.png',
    zorra: 'assets/img/zorra.png',
  };
}
