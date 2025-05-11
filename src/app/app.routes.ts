import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { MainComponent } from './components/main/main.component';
import { UsersComponent } from './components/users/users.component';
import { BrandComponent } from './components/brand/brand.component';
import { CategoryComponent } from './components/category/category.component';
import { PostListComponent } from './components/post-list/post-list.component';
import { CommentListComponent } from './components/comment-list/comment-list.component';
import { AddPostComponent } from './components/add-post/add-post.component';
import { AddUserComponent } from './components/add-user/add-user.component';
import { LoginComponent } from './components/login/login.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { OrderListComponent } from './components/order-list/order-list.component';
// import { AuthRoleGuard } from './guard/role.guard';
import { RoleGuard } from './guard/guards/auth.guard';
import { OrderDetailsComponent } from './components/order-details/order-details.component';
import { PostDetailsComponent } from './components/post-details/post-details.component';
// import { RoleGuard } from './guard/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'products',
        component: ProductListComponent,
        // canActivate: [RoleGuard],
        data: { expectedRoles: ['admin', 'shopManager'] },
      },
      { path: 'orders/:id', component: OrderDetailsComponent },
      { path: 'add-product', component: AddProductComponent },
      // { path: 'test', component: TestComponent },
      { path: 'users', component: UsersComponent },
      { path: 'add-user', component: AddUserComponent },
      // { path: 'add-category', component: AddCategoryComponent },
      { path: 'brand', component: BrandComponent },
      { path: 'category', component: CategoryComponent },
      { path: 'products/edit/:id', component: AddProductComponent },
      { path: 'orders', component: OrderListComponent },
      // { path: 'add-category', component: AddCategoryComponent },
      { path: 'list-posts', component: PostListComponent },
      { path: 'comment-list', component: CommentListComponent },
      { path: 'add-post', component: AddPostComponent },
      { path: 'post-details/:postId', component: PostDetailsComponent },
    ],
  },
];
