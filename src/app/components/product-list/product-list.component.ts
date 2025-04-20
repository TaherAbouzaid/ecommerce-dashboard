import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/Product/product.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
    imports: [CommonModule]
})
export class ProductListComponent implements OnInit {
  products: any[] = [];
  constructor(private productService: ProductService) { }

ngOnInit() {
    this.productService.getProducts().subscribe(products => {
      this.products = products;
    });
  }

}
