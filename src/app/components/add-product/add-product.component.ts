import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../services/Product/product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-product.component.html',
})
export class AddProductComponent implements OnInit {
  productForm: FormGroup;

  constructor(private fb: FormBuilder, private productService: ProductService) {
    this.productForm = this.fb.group({
      title: this.fb.group({
        en: ['', Validators.required],
        ar: ['', Validators.required],
      }),
     price: [1, [Validators.required, Validators.min(0)]], 
  quantity: [1, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit() {}

  onSubmit() {
    if (this.productForm.valid) {
      const productData = this.productForm.value;
      this.productService.addProduct(productData).then(() => {
        console.log('Done');
        this.productForm.reset();
      });
  }
}
}
