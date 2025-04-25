import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, FormsModule } from '@angular/forms';
import { ProductService } from '../../services/Product/product.service';
import { CommonModule } from '@angular/common';
import { Product, Variant } from '../../models/products';
import { Timestamp } from '@angular/fire/firestore';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { Editor } from 'primeng/editor';
import { InputNumber } from 'primeng/inputnumber';
import { Fluid } from 'primeng/fluid';
import { FileUpload } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { Validators } from '@angular/forms';

// import { InputNumberModule } from 'primeng/inputnumber';




@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [ReactiveFormsModule,
    ToastModule,
     ButtonModule,
    CommonModule,
    FloatLabelModule,
    FieldsetModule,
    InputTextModule,
    FormsModule,
    Editor,
    InputNumber,
     Fluid,
     InputTextModule,
     DropdownModule],
  templateUrl: './add-product.component.html',
})
export class AddProductComponent implements OnInit {
  productForm: FormGroup;



  constructor(private fb: FormBuilder, private productService: ProductService) {
    this.productForm = this.fb.group({
      productType: ['simple'],
      title: this.fb.group({
        en: ['', Validators.required],
        ar: ['', Validators.required],

      }),
      description: this.fb.group({
        en: [''],
        ar: [''],
      }),
      price: [1],
      discountPrice: [null],
      quantity: [1],
      sku: [''],
      brandId: [''],
      categoryId: [''],
      subCategoryId: [''],
      mainImage: [''],
      images: [[]],
      tags: [[]],
      vendorId: [''],
      ratingSummary: this.fb.group({
        average: [0],
        count: [0],
      }),
      views: [0],
      soldCount: [0],
      wishlistCount: [0],
      trendingScore: [0],
      cartAdds: [0],
      variants: this.fb.array([]),
      createdAt: [Timestamp.now()],
      updatedAt: [Timestamp.now()],
    });


  }

  ngOnInit() {}


  get variants(): FormArray {
    return this.productForm.get('variants') as FormArray;
  }


  getAttributes(variantIndex: number): FormArray {
    const variant = this.variants.at(variantIndex) as FormGroup;
    return variant.get('attributes') as FormArray;
  }


  createVariant(): FormGroup {
    return this.fb.group({
      title: this.fb.group({
        en: [''],
        ar: [''],
      }),
      attributes: this.fb.array([]),
      price: [null],
      discountPrice: [null],
      quantity: [null],
      mainImage: [''],
      images: [[]],
      sku: [''],
    });
  }


  createAttribute(): FormGroup {
    return this.fb.group({
      key: [''],
      value: [''],
    });
  }


  addVariant() {
    this.variants.push(this.createVariant());
  }


  removeVariant(index: number) {
    this.variants.removeAt(index);
  }


  addAttribute(variantIndex: number) {
    const attributes = this.getAttributes(variantIndex);
    attributes.push(this.createAttribute());
  }


  removeAttribute(variantIndex: number, attrIndex: number) {
    const attributes = this.getAttributes(variantIndex);
    attributes.removeAt(attrIndex);
  }


  async uploadImage(event: Event, controlName: string, variantIndex?: number) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const path = `products/${Date.now()}_${file.name}`;
      const url = await this.productService.uploadImage(file, path);
      if (variantIndex !== undefined) {
        const variant = this.variants.at(variantIndex) as FormGroup;
        variant.get(controlName)?.setValue(url);
      } else {
        this.productForm.get(controlName)?.setValue(url);
      }
    }
  }




  async uploadImages(event: Event, controlName: string, variantIndex?: number) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const files = Array.from(input.files);
      const urls = [];
      for (const file of files) {
        const path = `products/${Date.now()}_${file.name}`;
        const url = await this.productService.uploadImage(file, path);
        urls.push(url);
      }
      if (variantIndex !== undefined) {
        const variant = this.variants.at(variantIndex) as FormGroup;
        variant.get(controlName)?.setValue(urls);
      } else {
        this.productForm.get(controlName)?.setValue(urls);
      }
    }
  }

  onSubmit() {
    const productData = this.productForm.value;
    const variantsData = productData.variants;


    const variants = variantsData.map((variant: any) => {
      const attributesObj: { [key: string]: any } = {};
      variant.attributes.forEach((attr: any) => {
        attributesObj[attr.key] = attr.value;
      });
      variant.attributes = attributesObj;
      return variant;
    });


    delete productData.variants;


    if (typeof productData.tags === 'string') {
      productData.tags = productData.tags.split(',').map((tag: string) => tag.trim());
    }

    this.productService.addProduct(productData as Product, variants as Variant[]).then(() => {
      console.log('Done');
      this.productForm.reset();
    }).catch(error => {
      console.error('Error adding product:', error);
    });
  }
}
