export interface Product {
  id: number;
  name: string;
  category: string;
  unitPrice: number;
  expirationDate: string | null;
  inStock: number;
}

export interface getProductProps {
  name: String;
  category: String[];
  availability: String;
  sortBy1: String;
  sortDirection1: String;
  sortBy2: String;
  sortDirection2: String;
  page: number;
  size: number;
}

export interface TableProductsProps {
  products: Product[];
  onStockChange: () => Promise<void>;
  editProduct?: (data: Product) => void;
  deleteProduct?: (data: Product) => void;
  onTableChange: (params: {
    pageIndex: number;
    sortBy1?: string;
    sortDirection1?: string;
    sortBy2?: string;
    sortDirection2?: string;
  }) => void;
  pageCount: number;
  currentPage: number;
}

export interface CustomPage<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
}

export interface MetricProp {
  category: string;
  productCount: number;
  totalValue: number;
  averagePrice: number;
}

export interface FilterProductsProps {
  filterSearch: (
    name: string,
    category: string[],
    availability: string,
  ) => void;
  categories: string[];
}

export type FilterOption = { value: string; label: string };