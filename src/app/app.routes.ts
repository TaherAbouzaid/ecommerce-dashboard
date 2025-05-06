import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { MainComponent } from './components/main/main.component';
import { TestComponent } from './components/Test/Test.component';
import { UsersComponent } from './components/users/users.component';
// import { AddCategoryComponent } from './components/add-category/add-category.component';
// import { UpdateProductComponent } from './components/update-product/update-product.component';
import { BrandComponent } from './components/brand/brand.component';
import { CategoryComponent } from './components/category/category.component';
import { PostListComponent } from './components/post-list/post-list.component';
import { CommentListComponent } from './components/comment-list/comment-list.component';
import { AddPostComponent } from './components/add-post/add-post.component';

export const routes: Routes = [
  {
    path: '', component: MainComponent, children: [
      { path: 'products', component: ProductListComponent },
      { path: 'add-product', component: AddProductComponent },
      { path: 'test', component: TestComponent },
      { path: 'users', component: UsersComponent },
      // { path: 'add-category', component: AddCategoryComponent },
      { path: 'brand', component:BrandComponent},
      {path: 'category',component:CategoryComponent},
      { path: 'products/edit/:id', component: AddProductComponent },

      // { path: 'add-category', component: AddCategoryComponent },
      {path:'list-posts',component:PostListComponent},
      {path:'comment-list',component:CommentListComponent},
      {path:'add-post',component:AddPostComponent}


    ]
  }
];

