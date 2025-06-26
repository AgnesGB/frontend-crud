import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html', // Ou 'template' se for inline
  // styleUrls: ['./app.component.scss'] // Remova se o arquivo não existir
})
export class AppComponent { /* ... */ }