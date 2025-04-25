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

  // دالة لرفع صورة وإرجاع الرابط
  async uploadImage(file: File, path: string): Promise<string> {
    const storageRef = ref(this.storage, path);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  }

  // إضافة منتج مع الـ variants كـ subcollection
  async addProduct(product: Product, variants: Variant[]) {
    const productsCollection = collection(this.firestore, 'products');
    const docRef = await addDoc(productsCollection, product);

    // إضافة الـ variants كـ subcollection
    if (product.productType === 'variant' && variants.length > 0) {
      const variantsCollection = firestoreCollection(this.firestore, `products/${docRef.id}/variants`);
      for (const variant of variants) {
        await addDoc(variantsCollection, variant);
      }
    }

    return docRef.id;
  }

  // جلب المنتجات
  getProducts(): Observable<Product[]> {
    const productsCollection = collection(this.firestore, 'products');
    return collectionData(productsCollection, { idField: 'id' }) as Observable<Product[]>;
  }



  // جلب الـ variants لمنتج معين
  getVariants(productId: string): Observable<Variant[]> {
    const variantsCollection = firestoreCollection(this.firestore, `products/${productId}/variants`);
    return collectionData(variantsCollection, { idField: 'id' }) as Observable<Variant[]>;
  }
}
