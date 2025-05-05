import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, doc, updateDoc, deleteDoc, query, getDocs } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Product, Variant } from '../../models/products';
import { ref, uploadBytes, getDownloadURL, Storage } from '@angular/fire/storage';
import { Timestamp } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(
    private firestore: Firestore,
    private storage: Storage
  ) {}

  
  async addProduct(product: Product, variants: Variant[]): Promise<string> {
    try {
      const productRef = collection(this.firestore, 'allproducts');

      const defaultFields = {
        ratingSummary: { average: 0, count: 0 },
        wishlistCount: 0,
        trendingScore: 0,
        cartAdds: 0,
        soldCount: 0,
        views: 0,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      const newProductDoc = await addDoc(productRef, {
        ...defaultFields,
        ...product
      });

      const productId = newProductDoc.id;

      if (variants?.length) {
        const variantsRef = collection(this.firestore, `allproducts/${productId}/variants`);
        await Promise.all(variants.map(variant => addDoc(variantsRef, variant)));
      }

      return productId;
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  }


  getProducts(): Observable<Product[]> {
    const productsRef = collection(this.firestore, 'allproducts');
    return collectionData(productsRef, { idField: 'id' }) as Observable<Product[]>;
  }


  async getProductVariants(productId: string): Promise<Variant[]> {
    try {
      const variantsRef = collection(this.firestore, `allproducts/${productId}/variants`);
      const variantsQuery = query(variantsRef);
      const variantsSnapshot = await getDocs(variantsQuery);
      return variantsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Variant));
    } catch (error) {
      console.error('Error fetching variants:', error);
      throw error;
    }
  }


  async uploadImage(file: File, path: string): Promise<string> {
    if (!file.type.startsWith('image/')) {
      throw new Error('Only image files are allowed.');
    }
    const storageRef = ref(this.storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  }

  async uploadImages(files: File[], basePath: string): Promise<string[]> {
    return await Promise.all(
      files.map((file, index) => {
        const path = `${basePath}/${Date.now()}_${index}_${file.name}`;
        return this.uploadImage(file, path);
      })
    );
  }


  async updateProduct(productId: string, data: Partial<Product>): Promise<void> {
    const productDoc = doc(this.firestore, `allproducts/${productId}`);
    await updateDoc(productDoc, {
      ...data,
      updatedAt: Timestamp.now()
    });
  }


  async deleteProduct(productId: string): Promise<void> {
    try {

      const variantsRef = collection(this.firestore, `allproducts/${productId}/variants`);
      const variantsSnapshot = await getDocs(variantsRef);
      await Promise.all(variantsSnapshot.docs.map(variant => deleteDoc(variant.ref)));

      const productDoc = doc(this.firestore, `allproducts/${productId}`);
      await deleteDoc(productDoc);
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }
}
