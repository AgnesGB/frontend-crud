import { Routes } from '@angular/router';
import { ProductCrudComponent } from './product-crud.component';

export const routes: Routes = [
  { path: 'products', component: ProductCrudComponent },
  { path: '', redirectTo: '/products', pathMatch: 'full' },
];