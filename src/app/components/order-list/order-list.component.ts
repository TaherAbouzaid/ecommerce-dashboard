import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { OrderService } from '../../services/order/order.service';
import { OrderDisplay, OrderStatus } from '../../models/order.model';
import { Observable, tap, catchError, of } from 'rxjs';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, RouterModule, TableModule, ButtonModule, TagModule],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.css'
})
export class OrderListComponent implements OnInit {
  orders$: Observable<OrderDisplay[]> = of([]);
  loading: boolean = true;

  constructor(private orderService: OrderService) {
    this.loadOrders();
  }

  ngOnInit(): void {
    // Initial loading is handled in constructor
  }

  private loadOrders(): void {
    this.loading = true;
    this.orders$ = this.orderService.getAllOrders().pipe(
      tap(() => {
        console.log('Orders loaded successfully');
        this.loading = false;
      }),
      catchError(error => {
        console.error('Error loading orders:', error);
        this.loading = false;
        return of([]);
      })
    );
  }

  getStatusSeverity(status: OrderStatus): string {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'shipped':
        return 'info';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'danger';
      default:
        return 'info';
    }
  }

  getStatusLabel(status: OrderStatus): string {
    switch (status) {
      case 'pending':
        return 'قيد الانتظار';
      case 'shipped':
        return 'تم الشحن';
      case 'delivered':
        return 'تم التوصيل';
      case 'cancelled':
        return 'ملغي';
      default:
        return status;
    }
  }
}
