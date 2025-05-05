import { Injectable } from '@angular/core';
import { Firestore, collection, updateDoc,deleteDoc,addDoc,getDoc ,getDocs , collectionData, doc, collection as firestoreCollection, serverTimestamp, DocumentData, Timestamp } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product, Variant } from '../../models/products';
import { query } from 'firebase/firestore/lite';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(
    private firestore: Firestore,
    private storage: Storage) {}




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





  // //get product by id
  async getProductById(productId: string): Promise<Product | undefined> {
    const productDoc = doc(this.firestore, `allproducts/${productId}`);
    const productSnap = await getDoc(productDoc);
    if (productSnap.exists()) {
      return { id: productSnap.id, ...productSnap.data() } as Product;
    }
    return undefined;
  }


  //update product

  async updateProduct(productId: string, data: Partial<Product>): Promise<void> {
    const productDoc = doc(this.firestore, `allproducts/${productId}`);
    await updateDoc(productDoc, {
      ...data,
      updatedAt: Timestamp.now()
    });
  }

// ..............................................
//update with vraint
async updateProductWithVariants(productId: string, productData: Partial<Product>, variants: Variant[]): Promise<void> {
  try {
    // تحديث بيانات المنتج الأساسية
    await this.updateProduct(productId, productData);

    // حذف الـ Variants القديمة
    const variantsRef = collection(this.firestore, `allproducts/${productId}/variants`);
    const variantsSnapshot = await getDocs(variantsRef);
    await Promise.all(variantsSnapshot.docs.map(variant => deleteDoc(variant.ref)));

    // إضافة الـ Variants الجديدة
    if (variants?.length) {
      await Promise.all(variants.map(variant => addDoc(variantsRef, variant)));
    }
  } catch (error) {
    console.error('Error updating product with variants:', error);
    throw error;
  }
}
//...........................


  //delete product
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




