import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, FormsModule, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ProductService } from '../../services/Product/product.service';
import { CommonModule } from '@angular/common';
import { Product, Variant } from '../../models/products';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { EditorModule } from 'primeng/editor';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { MessageService } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { MessageModule } from 'primeng/message';
import { CategoryService } from '../../services/category/category.service';
import { Category, Subcategory } from '../../models/category';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ToastModule,
    ButtonModule,
    CommonModule,
    FloatLabelModule,
    FieldsetModule,
    InputTextModule,
    FormsModule,
    EditorModule,
    InputNumberModule,
    DropdownModule,
    RouterModule,
    MessageModule
  ],
  providers: [MessageService],
  templateUrl: './add-product.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddProductComponent implements OnInit {
  productForm: FormGroup;
  isFormInvalid: boolean = true;
  categories: Category[] = [];
  subcategories: Subcategory[] = [];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
    private categoryService: CategoryService
  ) {
    this.productForm = this.fb.group({
      productType: ['simple'],
      title: this.fb.group({
        en: ['', Validators.required],
        ar: ['', Validators.required]
      }),
      description: this.fb.group({
        en: [''],
        ar: ['']
      }),
      price: [1, Validators.required],
      discountPrice: [null],
      quantity: [1, Validators.required],
      sku: [''],
      brandId: [''],
      categoryId: [''],
      subCategoryId: [''],
      mainImage: [''],
      images: [[]],
      tags: [''],
      vendorId: [''],
      ratingSummary: this.fb.group({
        average: [0],
        count: [0]
      }),
      views: [0],
      soldCount: [0],
      wishlistCount: [0],
      trendingScore: [0],
      cartAdds: [0],
      variants: this.fb.array([])
    });

    this.productForm.get('productType')?.valueChanges.subscribe((type: string) => {
      const variants = this.variants;
      while (variants.length) {
        variants.removeAt(0);
      }
      if (type === 'variant') {
        variants.setValidators([Validators.minLength(1)]);
      } else {
        variants.clearValidators();
      }
      variants.updateValueAndValidity();
      this.updateFormValidity();
      this.cdr.markForCheck();
    });

    this.productForm.valueChanges.subscribe(() => {
      this.updateFormValidity();
    });
  }

  variantsValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const formArray = control as FormArray;
      if (!(formArray instanceof FormArray) || formArray.length === 0) {
        return null;
      }

      const hasValidVariant = formArray.controls.every(variant => {
        const attributes = variant.get('attributes') as FormArray;
        if (attributes.length === 0) {
          return true;
        }
        return attributes.controls.every(attr => {
          const key = attr.get('key')?.value?.trim();
          const value = attr.get('value')?.value?.trim();
          return key && value;
        });
      });

      return hasValidVariant ? null : { noValidVariants: true };
    };
  }

  ngOnInit() {
    this.categoryService.getCategories().subscribe((data: Category[]) => {
      this.categories = data;
      this.cdr.markForCheck();
    });

    this.categoryService.getSubcategories().subscribe((data: Subcategory[]) => {
      this.subcategories = data;
      this.cdr.markForCheck();
    });
    this.updateFormValidity();
  }

  get variants(): FormArray {
    return this.productForm.get('variants') as FormArray;
  }

  getAttributes(variantIndex: number): FormArray {
    const variant = this.variants.at(variantIndex) as FormGroup;
    const attributes = variant.get('attributes') as FormArray;
    return attributes;
  }

  createVariant(): FormGroup {
    const variant = this.fb.group({
      title: this.fb.group({
        en: [''],
        ar: ['']
      }),
      attributes: this.fb.array([]),
      price: [null],
      discountPrice: [null],
      quantity: [null],
      mainImage: [''],
      images: [[]],
      sku: ['']
    });
    return variant;
  }

  createAttribute(): FormGroup {
    const attribute = this.fb.group({
      key: ['', [Validators.required, Validators.minLength(1)]],
      value: ['', [Validators.required, Validators.minLength(1)]]
    });
    return attribute;
  }

  addVariant() {
    const newVariant = this.createVariant();
    this.variants.push(newVariant);
    this.updateFormValidity();
    this.cdr.markForCheck();
  }

  removeVariant(index: number) {
    this.variants.removeAt(index);
    this.updateFormValidity();
    this.cdr.markForCheck();
  }

  addAttribute(variantIndex: number) {
    const attributes = this.getAttributes(variantIndex);
    attributes.push(this.createAttribute());
    attributes.markAsTouched();
    this.updateFormValidity();
    this.cdr.markForCheck();
  }

  removeAttribute(variantIndex: number, attrIndex: number) {
    const attributes = this.getAttributes(variantIndex);
    attributes.removeAt(attrIndex);
    this.updateFormValidity();
    this.cdr.markForCheck();
  }

  saveAttribute(variantIndex: number, attrIndex: number) {
    const attributes = this.getAttributes(variantIndex);
    const attribute = attributes.at(attrIndex) as FormGroup;
    const keyControl = attribute.get('key');
    const valueControl = attribute.get('value');

    if (attribute.valid) {
      this.messageService.add({ severity: 'success', summary: 'Successfully', detail: 'The attribute was added successfully' });
      attributes.markAsPristine();
      this.updateFormValidity();
      this.cdr.markForCheck();
    } else {
      let errorMessage = 'Please enter key and value correctly';
      if (keyControl?.errors) {
        errorMessage = 'Invalid key: ' + (keyControl.errors['required'] ? 'Key is required' : 'Key is too short');
      } else if (valueControl?.errors) {
        errorMessage = 'Invalid value: ' + (valueControl.errors['required'] ? 'Value is required' : 'Value is too short');
      }
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: errorMessage });
      attribute.markAsTouched();
    }
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
      this.updateFormValidity();
      this.cdr.markForCheck();
    }
  }

  async uploadImages(event: Event, controlName: string, variantIndex?: number) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const files = Array.from(input.files);
      const uploadPromises = files.map(file => {
        const path = `products/${Date.now()}_${file.name}`;
        return this.productService.uploadImage(file, path);
      });
      const urls = await Promise.all(uploadPromises);
      if (variantIndex !== undefined) {
        const variant = this.variants.at(variantIndex) as FormGroup;
        variant.get(controlName)?.setValue(urls);
      } else {
        this.productForm.get(controlName)?.setValue(urls);
      }
      this.updateFormValidity();
      this.cdr.markForCheck();
    }
  }

  logInput(event: Event, field: string, variantIndex: number, attrIndex: number) {
    const input = event.target as HTMLInputElement;
    console.log(`Input ${field} for variant ${variantIndex}, attribute ${attrIndex}:`, input.value);
  }

  async onSubmit() {
    // Temporarily remove validators for variants to check base form validity
    const variants = this.variants;
    const originalValidators = variants.validator;
    variants.clearValidators();
    variants.updateValueAndValidity();

    if (this.productForm.invalid) {
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Please fill all required fields correctly' });
      variants.setValidators(originalValidators);
      variants.updateValueAndValidity();
      return;
    }


    variants.setValidators(originalValidators);
    variants.updateValueAndValidity();

    const productData = { ...this.productForm.value };
    const variantsData: Variant[] = Array.isArray(productData.variants) ? productData.variants : [];

    const variantsToSave = variantsData
      .map((variant: Variant) => {
        const attributes = Array.isArray(variant.attributes) ? variant.attributes.filter(attr => {
          const key = attr.key ? attr.key.trim() : null;
          const value = attr.value ? attr.value.trim() : null;
          return key && value && key !== '' && value !== '';
        }) : [];
        return { ...variant, attributes };
      })
      .filter((variant: Variant) => {
        return variant.title.en && variant.title.ar && variant.price != null && variant.quantity != null;
      });

    if (productData.productType === 'variant' && variantsToSave.length === 0) {
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Enter at least one valid variant' });
      return;
    }

    delete productData.variants;

    if (typeof productData.tags === 'string' && productData.tags.trim()) {
      productData.tags = productData.tags.split(',').map((tag: string) => tag.trim()).filter((tag: any) => tag);
    } else {
      productData.tags = [];
    }

    try {
      const productId = await this.productService.addProduct(productData as Product, variantsToSave as Variant[]);
      this.messageService.add({ severity: 'success', summary: 'Successfully', detail: 'Product added successfully' });
      this.productForm.reset();
      this.variants.clear();
      this.updateFormValidity();
      this.cdr.markForCheck();
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add product: '});
    }
  }

  updateFormValidity() {
    const productType = this.productForm.get('productType')?.value;
    if (productType === 'variant') {
      this.isFormInvalid = this.productForm.invalid || this.variants.length === 0;
    } else {
      this.isFormInvalid = this.productForm.invalid;
    }
    this.cdr.markForCheck();
  }

  trackByFn(index: number, item: any): number {
    return index;
  }
}
