import { Injectable } from '@angular/core';
import { Firestore, collection, updateDoc,deleteDoc,addDoc,getDoc ,getDocs , collectionData, doc, collection as firestoreCollection, serverTimestamp, DocumentData } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
    try{
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
catch (error: unknown) {
  console.error('Error adding product:', error);
  throw error;
}}


  getProducts(): Observable<Product[]> {
    const productsCollection = collection(this.firestore, 'products');
    return collectionData(productsCollection, { idField: 'id' }) as Observable<Product[]>;
  }


  getVariants(productId: string): Observable<Variant[]> {
    const variantsCollection = firestoreCollection(this.firestore, `products/${productId}/variants`);
    return collectionData(variantsCollection, { idField: 'id' }) as Observable<Variant[]>;
  }


  //get product by id
  async getProductById(productId: string): Promise<Product | undefined> {
    const productDoc = doc(this.firestore, `products/${productId}`);
    const productSnap = await getDoc(productDoc);
    if (productSnap.exists()) {
      return { id: productSnap.id, ...productSnap.data() } as Product;
    }
    return undefined;
  }


  //update product
   updateProduct(productId: string, updatedData: Partial<Product>): Promise<void> {
    try{
    const productDoc = doc(this.firestore, `products/${productId}`);
    // await updateDoc(productDoc, updatedData);
    return updateDoc(productDoc,{
      ...updatedData,
      updatedAt:serverTimestamp()
    })
    }
    catch (error: unknown) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  //delete product
  async deleteProduct(productId: string): Promise<void> {
    try {
      // Delete the variants if they exist
      const variantsCollection = firestoreCollection(this.firestore, `products/${productId}/variants`);
      const variantsSnapshot = await getDocs(variantsCollection);
        for (const docSnap of variantsSnapshot.docs) {
          await deleteDoc(docSnap.ref);
        }

      //  delete the product
      const productDoc = doc(this.firestore, `products/${productId}`);
      await deleteDoc(productDoc);
    } catch (error: unknown) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  getProductsAfterSearch(searchTerm: string): Observable<Product[]> {
    const productsCollection = collection(this.firestore, 'products');
    return collectionData(productsCollection, { idField: 'id' }).pipe(
      map((documents: DocumentData[]) => {
        const products = documents.map(doc => doc as Product);
        return products.filter(product => product.title.en.toLowerCase().includes(searchTerm.toLowerCase()));
      })
    );
  }



}




