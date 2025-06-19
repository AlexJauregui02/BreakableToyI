export interface Product {
  id: number;
  name: string;
  category: string;
  unitPrice: number;
  expirationDate: Date;
  inStock: number;
}

export interface CustomPage<T> {
  content: T[],
  pageNumber: number,
  pageSize: number,
  totalElements: number
}