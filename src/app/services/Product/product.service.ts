import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, doc, collection as firestoreCollection } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { Product, Variant } from '../../models/products';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private firestore: Firestore, private storage: Storage) {}


  async uploadImage(file: File, path: string): Promise<string> {
    const storageRef = ref(this.storage, path);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  }


  async addProduct(product: Product, variants: Variant[]) {
    const productsCollection = collection(this.firestore, 'products');
    const docRef = await addDoc(productsCollection, product);

    if (product.productType === 'variant' && variants.length > 0) {
      const variantsCollection = firestoreCollection(this.firestore, `products/${docRef.id}/variants`);
      for (const variant of variants) {
        await addDoc(variantsCollection, variant);
      }
    }

    return docRef.id;
  }

  getProducts(): Observable<Product[]> {
    const productsCollection = collection(this.firestore, 'products');
    return collectionData(productsCollection, { idField: 'id' }) as Observable<Product[]>;
  }

<<<<<<< HEAD


  // جلب الـ variants لمنتج معين
=======
>>>>>>> f7bb7ec3709f97e03f249ca619c74ba63abf57cc
  getVariants(productId: string): Observable<Variant[]> {
    const variantsCollection = firestoreCollection(this.firestore, `products/${productId}/variants`);
    return collectionData(variantsCollection, { idField: 'id' }) as Observable<Variant[]>;
  }
}
