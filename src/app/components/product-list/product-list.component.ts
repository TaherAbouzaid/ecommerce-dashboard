import { Category } from './../../models/category';
import { Product } from './../../models/products';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from '../../services/Product/product.service';
import { CommonModule } from '@angular/common';


import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { FileUpload } from 'primeng/fileupload';
import { SelectModule } from 'primeng/select';
import { Tag } from 'primeng/tag';
import { RadioButton } from 'primeng/radiobutton';
import { Rating } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { InputNumber } from 'primeng/inputnumber';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Table } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { Router, RouterModule } from '@angular/router';
import { Breadcrumb } from 'primeng/breadcrumb';
import { CategoryService } from '../../services/category/category.service';

interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

interface ExportColumn {
    title: string;
    dataKey: string;
}




@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  imports: [TableModule,
     Dialog,
      SelectModule,
      ButtonModule,
       ToastModule,
        ToolbarModule,
         ConfirmDialog,
         InputTextModule,
         TextareaModule,
         CommonModule,
         FileUpload,
         DropdownModule,
         Tag,
         RadioButton,
         Rating,
         InputTextModule,
         FormsModule,
         InputNumber,
         IconFieldModule,
        InputIconModule,
        Breadcrumb,
       RouterModule

        ],
  providers: [MessageService, ConfirmationService, ProductService,CategoryService],
  styles: [
    `:host ::ng-deep .p-dialog .product-image {
        width: 150px;
        margin: 0 auto 2rem auto;
        display: block;
    }`
]
})
export class ProductListComponent implements OnInit {
  products: any[] = [];
  product: any = {};
  productDialog: boolean = false;
  submitted: boolean = false;
  selectedProducts: any[] = [];
  statuses: any[] = [];
  categories: any[] = [];
  subCategories: any[] = [];

  @ViewChild('dt') dt!: Table;

  cols!: Column[];

  exportColumns!: ExportColumn[];
  firestore: any;
  items: MenuItem[] = [];







  constructor(
    private productService: ProductService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private categoryService: CategoryService
  ) {
    this.statuses = [
      { label: 'INSTOCK', value: 'INSTOCK' },
      { label: 'LOWSTOCK', value: 'LOWSTOCK' },
      { label: 'OUTOFSTOCK', value: 'OUTOFSTOCK' }
    ];
  }

  exportCSV() {
    this.dt.exportCSV();
}



ngOnInit() {

  this.loadDemoData();
    this.loadCategories();
    this.loadSubCategories();

    console.log(this.loadDemoData)

    this.items = [
      { icon: 'pi pi-home', route: '/' },
      { label: 'All Product', route: '/products' }
    ];


  }


  // items: MenuItem[] | undefined;
  home: MenuItem | undefined;


  loadDemoData() {
    this.productService.getProducts().subscribe((data) => {
      this.products = data.map(product => ({
        ...product,
        name: product.title?.en || 'No title',
        category: product.categoryId?.name?.en || 'No category',
        categoryId: product.categoryId?.categoryId || '',
        subCategory: product.subCategoryId?.name?.en || 'No sub category',
        subCategoryId: product.subCategoryId?.subcategoryId || '',
        inventoryStatus: this.getStatus(product.quantity || 0),
        rating: product.ratingSummary?.average || 0,
        updatedAt: product.updatedAt || null
      }));
      this.cd.markForCheck();
    });

    this.cols = [
      { field: 'name', header: 'Name' },
      { field: 'updatedAt', header: 'Last Update' },
      { field: 'image', header: 'Image' },
      { field: 'price', header: 'Price' },
      { field: 'category', header: 'Category' },
      { field: 'subCategory', header: 'Sub Category' },
      { field: 'rating', header: 'Reviews' },
      { field: 'inventoryStatus', header: 'Status' }
    ];

    this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
  }



// editProduct(productId: string): void {
//   this.router.navigate(['/update-product', productId]);
// }


//...............update.....................
editProduct(productId: string) {
  this.router.navigate(['/products/edit', productId]);
}
//..................................................


// deleteSelectedProducts() {
//   this.confirmationService.confirm({
//       message: 'Are you sure you want to delete the selected products?',
//       header: 'Confirm',
//       icon: 'pi pi-exclamation-triangle',
//       accept: () => {
//           if (this.selectedProducts) {
//               this.products = this.products.filter(p => !this.selectedProducts!.includes(p));
//           }
//           this.selectedProducts = [];

//           this.messageService.add({
//               severity: 'success',
//               summary: 'Successful',
//               detail: 'Products Deleted',
//               life: 3000
//           });
//       }
//   });
// }

hideDialog() {
  this.productDialog = false;
  this.submitted = false;
}

deleteProduct(productId: string): void {
    this.confirmationService.confirm({
        message: 'Are you sure you want to delete ?',
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.productService.deleteProduct(productId).then(() => {
            this.products = this.products.filter((val) => val.id !==productId);
            this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Product Deleted',
                life: 3000
            });
          }).catch(error => {
            alert('something went wrong');
            console.error('Error deleting product:', error);
          });
        }
        }
    );
  }

findIndexById(id: string): number {
  let index = -1;
  for (let i = 0; i < this.products.length; i++) {
      if (this.products[i].id === id) {
          index = i;
          break;
      }
  }

  return index;
}

// getCategoryName(category: string): string {
//   const categoryMap: { [key: string]: string } = {
//       'electronics': 'Electronics',
//       'clothing': 'Clothing',
//       'home': 'Home',
//       'books': 'Books',
//       // Add more categories as needed
//   };
//   return categoryMap[category] || category; // Return the mapped name or the original category if not found
// }


getSeverity(quantity: number): 'success' | 'warn' | 'danger' | 'secondary' {
  if (quantity > 10) return 'success';
  else if (quantity > 0) return 'warn';
  else if (quantity === 0) return 'danger';
  return 'secondary'; // Map 'unKnown' to 'secondary'
}

getStatus( quantity: number) {
  if (quantity === 0) {
      return 'outofstock';
  }
  else if (quantity < 5) {
      return 'lowstock';
  } else {
      return 'instock';
  }
}


getProductName(product: Product): string {
  return product.title.en || 'Unknown Product';
}

get productName():string{
  return this.product.title.en

}




filterGlobal(event: Event, matchMode: string) {
  const target = event.target as HTMLInputElement;
  if (target) {
    this.dt.filterGlobal(target.value, matchMode);
  }
}

filterColumn(value: any, field: string, mode: string) {
  if (value === null || value === undefined) {
    this.dt.filter(null, field, mode);
  } else {
    this.dt.filter(value, field, mode);
  }
}
createProduct(): void {
  this.router.navigate(['/add-product']);
}


loadCategories() {
  this.categoryService.getCategories().subscribe({
    next: (categories) => {
      this.categories = categories.map(cat => ({
        label: cat.name?.en || 'Unknown',
        value: cat.categoryId
      }));
    },
    error: (error) => {
      console.error('Error loading categories:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load categories'
      });
    }
  });
}

loadSubCategories(categoryId?: string) {
  this.categoryService.getSubcategories().subscribe({
    next: (subCategories) => {
      let filteredSubCategories = subCategories;
      if (categoryId) {
        filteredSubCategories = subCategories.filter(subCat => subCat.parentCategoryId === categoryId);
      }
      this.subCategories = filteredSubCategories.map((subCat: any) => ({
        label: subCat.name?.en || 'Unknown',
        value: subCat.subcategoryId
      }));
    },
    error: (error: any) => {
      console.error('Error loading subcategories:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load subcategories'
      });
    }
  });
}

onCategoryChange(event: any) {
  this.loadSubCategories(event.value);
  this.filterColumn(event.value, 'categoryId', 'equals');
}

onSubCategoryChange(event: any) {
  this.filterColumn(event.value, 'subCategoryId', 'equals');
}




// get catName(catId:string) : string{
//   const catagory =this.catagory.find((cat)=>{
//     catagory?.cat===catId})
//     return catagory ? (catagory.name.en || 'unknown category') : 'unknown category';
//   }

  // getCategoryName(catId: string): string {
  //   const category = this.catagory.find((cat) => cat.categoryId === catId);
  //   return category ? category.name.en : 'Unknown Category';
  // }


  filterProducts(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.dt.filter(value, 'title.en', 'contains');
  }
  






// SearchProducts(event: any, stringVal: string) {
//   const searchTerm = event.target.value.toLowerCase();
//   this.products = this.products.filter((product) =>
//     product.name.toLowerCase().includes(searchTerm)
//   );
//   if (searchTerm === '') {
//     this.loadDemoData(); // Reload the original data if search term is empty
//   }
//   this.cd.markForCheck(); // Mark for check to update the view
}












































































