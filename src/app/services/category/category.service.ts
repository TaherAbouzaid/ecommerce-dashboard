import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  updateDoc,
  deleteDoc,
  addDoc,
  Timestamp
} from '@angular/fire/firestore';
import { Category, Subcategory } from '../../models/category';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private categoryRef;
  private subcategoryRef;

  constructor(private firestore: Firestore) {
    this.categoryRef = collection(this.firestore, 'categories');
    this.subcategoryRef = collection(this.firestore, 'subcategories');
  }

  // Get all categories
  getCategories(): Observable<Category[]> {
    return collectionData(this.categoryRef, { idField: 'categoryId' }) as Observable<Category[]>;
  }

  // Get all subcategories
  getSubcategories(): Observable<Subcategory[]> {
    return collectionData(this.subcategoryRef, { idField: 'subcategoryId' }) as Observable<Subcategory[]>;
  }

  // Add category
  async addCategory(category: Omit<Category, 'categoryId'>): Promise<string> {
    const docRef = await addDoc(this.categoryRef, {
      ...category,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  }

  // Add subcategory
  async addSubcategory(subcategory: Omit<Subcategory, 'subcategoryId'>): Promise<string> {
    const docRef = await addDoc(this.subcategoryRef, {
      ...subcategory,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  }

  // Update category
  updateCategory(id: string, data: Partial<Category>) {
    const docRef = doc(this.firestore, `categories/${id}`);
    return updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
  }

  // Update subcategory
  updateSubcategory(id: string, data: Partial<Subcategory>) {
    const docRef = doc(this.firestore, `subcategories/${id}`);
    return updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
  }

  // Delete category
  deleteCategory(id: string) {
    const docRef = doc(this.firestore, `categories/${id}`);
    return deleteDoc(docRef);
  }

  // Delete subcategory
  deleteSubcategory(id: string) {
    const docRef = doc(this.firestore, `subcategories/${id}`);
    return deleteDoc(docRef);
  }
}
