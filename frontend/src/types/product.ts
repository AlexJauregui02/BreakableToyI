export interface Product {
  id: string;
  name: string;
  category: string;
  unitPrice: number;
  expiresAt: Date;
  inStock: number;
  createdAt: Date;
  updatedAt: Date;
}