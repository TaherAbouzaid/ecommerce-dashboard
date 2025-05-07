import { Timestamp } from 'firebase/firestore';
export interface User {
    userId: string;
    name: string;
    email: string;
    phone: string;
    role: 'customer' | 'main admin' | 'shop manager' | 'vendor';
    address: string[];
    wishlist: {
      productId: string;
      title: { en: string; ar: string };
      mainImage: string;
      price: number;
    }[];
    createdAt: Timestamp;
    updatedAt: Timestamp;
    selected?: boolean;
    [key: string]: any;
}


/*
import firebase from 'firebase/compat/app';

export type UserRole = 'customer' | 'admin' | 'shop manager' | 'vendor';

export interface Address {
  street?: string;
  city?: string;
  country?: string;
  postalCode?: string;
}

export interface WishlistItem {
  productId: string;
  title: { en: string; ar: string };
  mainImage: string;
  price: number;
}

export interface User {
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  address: Address[];
  wishlist: WishlistItem[];
  createdAt: firebase.firestore.Timestamp;
  updatedAt: firebase.firestore.Timestamp;
  isActive?: boolean;
  isVerified?: boolean;
  preferredLanguage?: 'en' | 'ar';
}

*/
