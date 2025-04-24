import { Timestamp } from '@angular/fire/firestore';

export interface LocalizedString {
  en: string;
  ar: string;
}


interface RatingSummary {
  average: number;
  count: number;
}

export interface Variant {
   id?: string;
  title: LocalizedString;
  attributes: { [key: string]: any };
  price: number | null;
  discountPrice: number | null;
  quantity: number | null;
  mainImage: string;
  images: string[];
  sku: string;
}

export interface Product {
  id?: string;
  productId: string;
  productType: 'simple' | 'variant';
  title: LocalizedString;
  description: LocalizedString;
  price: number;
  discountPrice: number | null;
  quantity: number;
  sku: string;
  brandId: string;
  categoryId: string;
  subCategoryId: string;
  mainImage: string;
  images: string[];
  tags: string[];
  vendorId: string;
  ratingSummary: RatingSummary;
  views: number;
  soldCount: number;
  wishlistCount: number;
  trendingScore: number;
  cartAdds: number;
  variants: Variant[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
