import { Routes } from '@angular/router';
import { ProductCrudComponent } from './product-crud.component';
import { ProductListPageComponent } from './pages/product-list-page/product-list-page.component';
import { ProductFormPageComponent } from './pages/product-form-page/product-form-page.component';
import { ProductDetailPageComponent } from './pages/product-detail-page/product-detail-page.component';

export const routes: Routes = [
  // Rota principal - Dashboard/CRUD completo
  { path: 'products', component: ProductCrudComponent },
  
  // Rotas específicas para cada operação
  { path: 'products/list', component: ProductListPageComponent },
  { path: 'products/new', component: ProductFormPageComponent },
  { path: 'products/edit/:id', component: ProductFormPageComponent },
  { path: 'products/detail/:id', component: ProductDetailPageComponent },
  
  // Redirecionamento padrão
  { path: '', redirectTo: '/products', pathMatch: 'full' },
  
  // Rota curinga para páginas não encontradas
  { path: '**', redirectTo: '/products' }
];