import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { MainComponent } from './components/main/main.component';
import { TestComponent } from './components/Test/Test.component';
import { UsersComponent } from './components/users/users.component';
import { AddCategoryComponent } from './components/add-category/add-category.component';
import { UpdateProductComponent } from './components/update-product/update-product.component';
import { BrandComponent } from './components/brand/brand.component';
import { CategoryComponent } from './components/category/category.component';

export const routes: Routes = [
  {
    path: '', component: MainComponent, children: [
      { path: 'products', component: ProductListComponent },
      { path: 'add-product', component: AddProductComponent },
      { path: 'test', component: TestComponent },
      { path: 'users', component: UsersComponent },
      { path: 'add-category', component: AddCategoryComponent },
      { path: 'brand', component:BrandComponent},
      {path: 'categories',component:CategoryComponent},
      { path: 'products/edit/:id', component: AddProductComponent }


    ]
  }
];

