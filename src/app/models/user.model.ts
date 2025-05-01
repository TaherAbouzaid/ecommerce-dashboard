
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
    createdAt: Date;
    updatedAt: Date;
    selected?: boolean; 
  }