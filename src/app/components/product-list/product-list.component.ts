import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from '../../services/Product/product.service';
import { CommonModule } from '@angular/common';


import { ConfirmationService, MessageService } from 'primeng/api';
// import { Product } from '@/domain/product';
import { Product } from '../../models/products';
import { TableModule } from 'primeng/table';
import { Dialog } from 'primeng/dialog';
import { Ripple } from 'primeng/ripple';
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
  imports: [TableModule, Dialog, SelectModule,ButtonModule, ToastModule, ToolbarModule, ConfirmDialog, InputTextModule, TextareaModule, CommonModule, FileUpload, DropdownModule, Tag, RadioButton, Rating, InputTextModule, FormsModule, InputNumber, IconFieldModule, InputIconModule],
  providers: [MessageService, ConfirmationService, ProductService],
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
  productDialog: boolean = false;
  product!: Product;

    selectedProducts!: Product[] | null;

    submitted: boolean = false;

    statuses!: any[];

    @ViewChild('dt') dt!: Table;

    cols!: Column[];

    exportColumns!: ExportColumn[];





  constructor(
    private productService: ProductService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private cd: ChangeDetectorRef

  ) { }

  exportCSV() {
    this.dt.exportCSV();
}



ngOnInit() {
    // this.productService.getProducts().subscribe(products => {
    //   this.products = products;
    // });

    this.loadDemoData();
  }

  loadDemoData() {
      this.productService.getProducts().subscribe((data) => {
          this.products = data;
          console.log('Products:', this.products);

          this.cd.markForCheck();
      });

      this.statuses = [
        { label: 'INSTOCK', value: 'instock' },
        { label: 'LOWSTOCK', value: 'lowstock' },
        { label: 'OUTOFSTOCK', value: 'outofstock' }
    ];

    this.cols = [
        { field: 'code', header: 'Code', customExportHeader: 'Product Code' },
        { field: 'name', header: 'Name' },
        { field: 'image', header: 'Image' },
        { field: 'price', header: 'Price' },
        { field: 'category', header: 'Category' }
    ];

    this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
  }

//   openNew() {
//     this.product = {};
//     this.submitted = false;
//     this.productDialog = true;
// }

editProduct(product: Product) {
    this.product = { ...product };
    this.productDialog = true;
}

deleteSelectedProducts() {
  this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected products?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          this.products = this.products.filter((val) => !this.selectedProducts?.includes(val));
          this.selectedProducts = null;
          this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Products Deleted',
              life: 3000
          });
      }
  });
}

hideDialog() {
  this.productDialog = false;
  this.submitted = false;
}

// deleteProduct(product: Product) {
//   this.confirmationService.confirm({
//       message: 'Are you sure you want to delete ' + product.name + '?',
//       header: 'Confirm',
//       icon: 'pi pi-exclamation-triangle',
//       accept: () => {
//           this.products = this.products.filter((val) => val.id !== product.id);
//           this.product = {};
//           this.messageService.add({
//               severity: 'success',
//               summary: 'Successful',
//               detail: 'Product Deleted',
//               life: 3000
//           });
//       }
//   });
// }

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

createId(): string {
  let id = '';
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (var i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

getSeverity(status: string) {
  switch (status) {
      case 'INSTOCK':
          return 'success';
      case 'LOWSTOCK':
          return 'warn';
      case 'OUTOFSTOCK':
          return 'danger';
      default:
          return 'unKnown';
  }
}

// saveProduct() {
//   this.submitted = true;

//   if (this.product.name?.trim()) {
//       if (this.product.id) {
//           this.products[this.findIndexById(this.product.id)] = this.product;
//           this.messageService.add({
//               severity: 'success',
//               summary: 'Successful',
//               detail: 'Product Updated',
//               life: 3000
//           });
//       } else {
//           this.product.id = this.createId();
//           this.product.image = 'product-placeholder.svg';
//           this.products.push(this.product);
//           this.messageService.add({
//               severity: 'success',
//               summary: 'Successful',
//               detail: 'Product Created',
//               life: 3000
//           });
//       }
//       this.products = [...this.products];
//       this.productDialog = false;
//       this.product = {};
//   }
// }
}






































































// @Component({
//   selector: 'app-product-list',
//   templateUrl: './product-list.component.html',
//   styleUrls: ['./product-list.component.css'],
//     imports: [CommonModule]
// })
// export class ProductListComponent implements OnInit {
//   products: any[] = [];
//   constructor(private productService: ProductService) { }

// ngOnInit() {
//     this.productService.getProducts().subscribe(products => {
//       this.products = products;
//     });
//   }

// }
