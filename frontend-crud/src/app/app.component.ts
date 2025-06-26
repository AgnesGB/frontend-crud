// src/app/app.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router'; // <-- Importe o RouterOutlet

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet], // <-- Adicione RouterOutlet aqui
  template: `
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {
  title = 'CRUD de Produtos com PrimeNG';
}