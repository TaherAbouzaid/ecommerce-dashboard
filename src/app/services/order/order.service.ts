import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where, orderBy, Timestamp, collectionData, docData, getDoc } from '@angular/fire/firestore';
import { Order, OrderStatus, OrderDisplay } from '../../models/order.model';
import { Observable, from, map, take, tap, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly COLLECTION_NAME = 'orders';

  constructor(private firestore: Firestore) { }

  private transformOrderData(doc: any): OrderDisplay {
    try {
      const data = doc.data();
      console.log('Transform: Raw data from Firestore:', data); // Debug log

      if (!data) {
        console.log('Transform: No data found in document'); // Debug log
        return this.getDefaultOrderDisplay(doc.id);
      }

      const transformedOrder: OrderDisplay = {
        id: doc.id,
        customerId: data.customerId || '',
        customerName: data.customerName || 'Unknown Customer',
        customerEmail: data.customerEmail || 'No Email',
        customerPhone: data.customerPhone || 'No Phone',
        items: Array.isArray(data.items) ? data.items : [],
        totalAmount: Number(data.totalAmount) || 0,
        status: this.validateStatus(data.status),
        paymentMethod: data.paymentMethod || 'cash',
        paymentStatus: data.paymentStatus || 'pending',
        shippingAddress: data.shippingAddress || 'No Address',
        createdAt: this.parseDate(data.createdAt),
        updatedAt: this.parseDate(data.updatedAt)
      };

      console.log('Transform: Transformed order:', transformedOrder); // Debug log
      return transformedOrder;
    } catch (error) {
      console.error('Transform: Error transforming order data:', error);
      return this.getDefaultOrderDisplay(doc.id);
    }
  }

  private getDefaultOrderDisplay(id: string): OrderDisplay {
    return {
      id,
      customerId: '',
      customerName: 'Unknown Customer',
      customerEmail: 'No Email',
      customerPhone: 'No Phone',
      items: [],
      totalAmount: 0,
      status: 'pending',
      paymentMethod: 'cash',
      paymentStatus: 'pending',
      shippingAddress: 'No Address',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  private validateStatus(status: any): OrderStatus {
    const validStatuses: OrderStatus[] = ['pending', 'shipped', 'delivered', 'cancelled'];
    return validStatuses.includes(status) ? status : 'pending';
  }

  private parseDate(date: any): Date {
    if (date instanceof Timestamp) {
      return date.toDate();
    }
    if (date instanceof Date) {
      return date;
    }
    if (typeof date === 'string') {
      return new Date(date);
    }
    if (typeof date === 'number') {
      return new Date(date);
    }
    return new Date();
  }

  // Create new order
  createOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Observable<string> {
    const orderData = {
      ...order,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    return from(addDoc(collection(this.firestore, this.COLLECTION_NAME), orderData))
      .pipe(map(docRef => docRef.id));
  }

  // Get all orders
  getAllOrders(): Observable<OrderDisplay[]> {
    const ordersRef = collection(this.firestore, this.COLLECTION_NAME);
    const q = query(ordersRef, orderBy('createdAt', 'desc'));
    return from(getDocs(q)).pipe(
      map(snapshot => 
        snapshot.docs.map(doc => this.transformOrderData(doc))
      )
    );
  }

  // Get orders by user ID
  getOrdersByUserId(userId: string): Observable<OrderDisplay[]> {
    const ordersRef = collection(this.firestore, this.COLLECTION_NAME);
    const q = query(
      ordersRef,
      where('customerId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    return from(getDocs(q)).pipe(
      map(snapshot => 
        snapshot.docs.map(doc => this.transformOrderData(doc))
      )
    );
  }

  // Get order by ID
  getOrderById(id: string): Observable<OrderDisplay | null> {
    console.log('Service: Getting order by ID:', id); // Debug log
    if (!id) {
      console.log('Service: Invalid order ID provided'); // Debug log
      return of(null);
    }

    const orderRef = doc(this.firestore, this.COLLECTION_NAME, id);
    return from(getDoc(orderRef)).pipe(
      tap(doc => {
        console.log('Service: Firestore doc exists:', doc.exists()); // Debug log
        if (doc.exists()) {
          console.log('Service: Raw doc data:', doc.data()); // Debug log
        }
      }),
      map(doc => {
        if (doc.exists()) {
          const transformedOrder = this.transformOrderData(doc);
          console.log('Service: Transformed order:', transformedOrder); // Debug log
          return transformedOrder;
        }
        console.log('Service: No order found with ID:', id); // Debug log
        return null;
      }),
      catchError(error => {
        console.error('Service: Error getting order:', error);
        return of(null);
      })
    );
  }

  // Update order status
  updateOrderStatus(id: string, status: OrderStatus): Observable<void> {
    const orderRef = doc(this.firestore, this.COLLECTION_NAME, id);
    return from(updateDoc(orderRef, { 
      status,
      updatedAt: Timestamp.now()
    }));
  }

  // Delete order
  deleteOrder(orderId: string): Observable<void> {
    const orderRef = doc(this.firestore, this.COLLECTION_NAME, orderId);
    return from(deleteDoc(orderRef));
  }
}
