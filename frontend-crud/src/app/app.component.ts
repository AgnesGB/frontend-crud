// src/app/app.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html', // APONTA PARA O ARQUIVO HTML
})
export class AppComponent {
  title = 'CRUD de Produtos com PrimeNG';
}