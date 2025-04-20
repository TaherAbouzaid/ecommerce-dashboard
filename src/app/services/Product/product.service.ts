import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, addDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private firestore: Firestore) {}


  getProducts(): Observable<any[]> {
    const productsCollection = collection(this.firestore, 'allproducts');
    return collectionData(productsCollection, { idField: 'id' });
  }


  addProduct(product: any) {
    const productsCollection = collection(this.firestore, 'allproducts');
    return addDoc(productsCollection, product);
  }
}
