import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { PanelMenu } from 'primeng/panelmenu';


@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css'],
  imports: [PanelMenu],
  standalone: true
})
export class SideBarComponent implements OnInit {

    items!: MenuItem[];



    ngOnInit() {
    this.items = [
  {
    label: 'Dashboard',
    icon: 'pi pi-home',
    routerLink: ['/dashboard']
  },
  {
    label: 'Products',
    icon: 'pi pi-box',
    items: [
      { label: 'All Products', icon: 'pi pi-list', routerLink: ['/products'] },
      { label: 'Add Product', icon: 'pi pi-plus', routerLink: ['/add-product'] },
      { label: 'Orders', icon: 'pi pi-shopping-cart', routerLink: ['/orders'] },
      { label: 'Stock', icon: 'pi pi-briefcase', routerLink: ['/stock'] },
      
    ]
  },
  {
    label: 'Categories',
    icon: 'pi pi-tags',
    items: [
      {
        label: 'All Categories', icon: 'pi pi-list', routerLink: ['/category'] },
      { label: 'Add Category', icon: 'pi pi-plus', routerLink: ['/add-category'] }
    ]
  },
  {
    label: 'Brands',
    icon: 'pi pi-tag',
    items: [
      { label: 'All Brands', icon: 'pi pi-list', routerLink: ['/brand'] },
      { label: 'Add Brand', icon: 'pi pi-plus', routerLink: ['/add-brand'] }
    ]
  },
  {
    label: 'Users',
    icon: 'pi pi-users',
    items: [
      { label: 'All Users', icon: 'pi pi-list', routerLink: ['/users'] },
      { label: 'Add User', icon: 'pi pi-user-plus', routerLink: ['/add-user'] },
    ]
  },
  {
    label: 'Reports',
    icon: 'pi pi-chart-line',
    routerLink: ['/reports']
  },
  {
    label: 'Pages',
    icon: 'pi pi-file',
    routerLink: ['/pages']
  },
  {
    label: 'Messages',
    icon: 'pi pi-comments',
    routerLink: ['/messages']
  },
  {
    label: 'Settings',
    icon: 'pi pi-cog',
    routerLink: ['/settings']
  },
  {
    label: 'Logout',
    icon: 'pi pi-sign-out',
    routerLink: ['/logout']
  }
];
  }
}
