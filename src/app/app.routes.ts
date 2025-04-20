import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { AddProductComponent } from './components/add-product/add-product.component';

export const routes: Routes = [
  {path:"list", component: ProductListComponent},
  {path:"", component: AddProductComponent},
];
