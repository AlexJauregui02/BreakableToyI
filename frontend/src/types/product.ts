export interface Product {
  id: number;
  name: string;
  category: string;
  unitPrice: number;
  expirationDate: Date;
  inStock: number;
}

export interface getProductProps {
    name: String,
    category: String[],
    availability: String,
    sortBy1: String,
    sortDirection1: String,
    sortBy2: String,
    sortDirection2: String,
    page: number,
    size: number
}

export interface CustomPage<T> {
  content: T[],
  pageNumber: number,
  pageSize: number,
  totalElements: number
}