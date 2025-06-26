// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { ProductCrudComponent } from './product-crud.component';

export const routes: Routes = [
  { path: 'products', component: ProductCrudComponent }, // Rota explícita para o CRUD
  { path: '', redirectTo: '/products', pathMatch: 'full' }, // <-- Redireciona a raiz para o CRUD
];