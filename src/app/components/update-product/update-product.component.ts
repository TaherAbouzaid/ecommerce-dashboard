import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/Product/product.service';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, FormsModule } from '@angular/forms';
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
import { Toast } from 'primeng/toast';
import { Ripple } from 'primeng/ripple';
import { MessageService } from 'primeng/api';
import { MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { RouterModule } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { BrandService } from '../../services/brand/brand.service';
import { Brand } from '../../models/brands';
import { Select, SelectModule } from 'primeng/select';
@Component({
  selector: 'app-update-product',
  imports:  [ReactiveFormsModule,
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
     DropdownModule,
     Toast,
     Ripple,
     Breadcrumb,
    RouterModule,
    Select,
    SelectModule,
    ],
    providers: [MessageService,BrandService],

  templateUrl: './update-product.component.html',
  styleUrl: './update-product.component.css'
})
export class UpdateProductComponent implements OnInit {
  // brands: any[] = [];
  updateForm: FormGroup;
  productId!: string;
  brands: Brand[] = [];


  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private messageService: MessageService,
    private brandService:BrandService

  ) {
    this.updateForm = this.fb.group({
      productType: ['', Validators.required],
      price: ['', Validators.required],
      imageUrl: [''],
      title: this.fb.group({
        en: ['', Validators.required],
        ar: ['', Validators.required],

      }),
      description: this.fb.group({
        en: [''],
        ar: [''],
      }),
      discountPrice: [null],
      quantity: [],
      sku: [''],
      brandId: [''],
      categoryId: [''],
      subCategoryId: [''],
      mainImage: [''],
      images: [[]],
      tags: [[]],
      vendorId: [''],
      ratingSummary: this.fb.group({
        average: [],
        count: [],
      }),
      views: [],
      soldCount: [],
      wishlistCount: [],
      trendingScore: [],
      cartAdds: [],
      variants: this.fb.array([]),
      createdAt: [Timestamp.now()],
      updatedAt: [Timestamp.now()],    });
  }

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id')!;

    this.productService.getProductById(this.productId).then(product => {
      if (!product) return;

      // simplely set the values of the form controls
      this.updateForm.patchValue({
        productType: product.productType,
        price: product.price,
        // imageUrl: product.imageUrl,
        discountPrice: product.discountPrice,
        quantity: product.quantity,
        sku: product.sku,
        brandId: product.brandId,
        categoryId: product.categoryId,
        subCategoryId: product.subCategoryId,
        mainImage: product.mainImage,
        images: product.images || [],
        tags: product.tags || [],
        vendorId: product.vendorId,
        views: product.views || 0,
        soldCount: product.soldCount || 0,
        wishlistCount: product.wishlistCount || 0,
        trendingScore: product.trendingScore || 0,
        cartAdds: product.cartAdds || 0,
      });

      // title and description are objects, so we need to set them separately
      this.updateForm.get('title')?.patchValue(product.title);
      this.updateForm.get('description')?.patchValue(product.description);
      this.updateForm.get('ratingSummary')?.patchValue(product.ratingSummary);

      //   variants is an array of objects, so we need to loop through it and create a form group for each variant
      this.variants.clear();
      if (product.variants && product.variants.length > 0) {
        product.variants.forEach(variant => {
          const variantGroup = this.createVariant();
          variantGroup.patchValue({
            price: variant.price,
            discountPrice: variant.discountPrice,
            quantity: variant.quantity,
            mainImage: variant.mainImage,
            images: variant.images || [],
            sku: variant.sku,
          });

          variantGroup.get('title')?.patchValue(variant.title);

          const attrArray = variantGroup.get('attributes') as FormArray;
          variant.attributes?.['forEach']((attr: { key: string; value: string }) => {
            attrArray.push(this.fb.group({
              key: [attr.key],
              value: [attr.value]
            }));
          });

          this.variants.push(variantGroup);
        });
      }

    });

    this.items = [
      { icon: 'pi pi-home', route: '/' },
      { label: 'Edit Product', route: '/update-product' }
    ];

    this.getBrands()
  }

  items: MenuItem[] | undefined;

  home: MenuItem | undefined;

  //.......


  get variants(): FormArray {
    return this.updateForm.get('variants') as FormArray;
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
        this.updateForm.get(controlName)?.setValue(url);
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
        this.updateForm.get(controlName)?.setValue(urls);
      }
    }
  }
//..............................
  async onSubmit() {
    if (this.updateForm.invalid) return;
    console.log('Submitting:', this.updateForm.value);


    try {
    const updatedData: Partial<Product> = this.updateForm.value;
    await this.productService.updateProduct(this.productId, updatedData);
    console.log('Product updated successfully');
    this.showSuccess();

    setTimeout(() => {
      this.router.navigate(['/products']);
    }, 1000);
    }
    catch (error) {
      console.error('Error updating product:', error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update product' });
    }
  }

  showSuccess() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product updated succesfuly' });
};


getBrands(): void {
  this.brandService.getBrands().subscribe((brands) => {
    this.brands = brands;
    console.log(this.brands);

  });
}
}
