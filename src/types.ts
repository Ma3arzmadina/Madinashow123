export type Language = 'ku' | 'en' | 'ar';

export interface Truck {
  id: string;
  title: string;
  make: string;
  model: string;
  year: number;
  mileage: number; // in kilometers
  priceUSD: number;
  plateNumber?: string; // e.g. "Erbil 22 A 19482"
  transmission?: 'Automatic' | 'Manual' | 'Semi-Automatic' | string;
  fuelType?: 'Diesel' | 'Electric' | 'Hybrid' | 'CNG' | string;
  axleConfig?: string; // e.g. "4x2", "6x2", "6x4"
  horsepower?: number;
  condition?: 'Used' | 'Brand New' | 'Certified Pre-Owned' | string;
  color?: string;
  descriptionEn?: string;
  descriptionKu?: string;
  descriptionAr?: string;
  images: string[];
  status: 'available' | 'reserved' | 'sold';
  featured?: boolean;
  createdAt?: any;
  updatedAt?: any;
  createdBy: string;
  createdByEmail?: string;
}

export interface AdminUser {
  id: string; // user UID or email
  email: string;
  role: 'owner' | 'admin' | 'manager';
  addedBy?: string;
  plateAccess?: string;
  createdAt?: any;
}

export interface FilterState {
  searchQuery: string;
  make: string;
  model: string;
  yearMin: string;
  yearMax: string;
  mileageMax: string;
  priceMin: string;
  priceMax: string;
  condition: string;
  status: string;
  sortBy: 'newest' | 'price-asc' | 'price-desc' | 'mileage-asc' | 'year-desc';
}
