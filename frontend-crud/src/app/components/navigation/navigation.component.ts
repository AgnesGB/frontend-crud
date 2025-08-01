import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MenubarModule
  ],
  template: `
    <p-menubar [model]="menuItems">
      <ng-template pTemplate="start">
        <span class="app-title">
          <i class="pi pi-shopping-cart"></i>
          Sistema de Produtos
        </span>
      </ng-template>
    </p-menubar>
  `,
  styles: [`
    .app-title {
      font-weight: 600;
      color: #495057;
      font-size: 1.2rem;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    :host ::ng-deep .p-menubar {
      margin-bottom: 20px;
    }
  `]
})
export class NavigationComponent {
  menuItems: MenuItem[] = [];

  constructor(private router: Router) {
    this.menuItems = [
      {
        label: 'CRUD Completo',
        icon: 'pi pi-home',
        command: () => this.router.navigate(['/products'])
      },
      {
        label: 'Produtos',
        icon: 'pi pi-box',
        items: [
          {
            label: 'Listar Produtos',
            icon: 'pi pi-list',
            command: () => this.router.navigate(['/products/list'])
          },
          {
            label: 'Novo Produto',
            icon: 'pi pi-plus',
            command: () => this.router.navigate(['/products/new'])
          }
        ]
      }
    ];
  }
}
