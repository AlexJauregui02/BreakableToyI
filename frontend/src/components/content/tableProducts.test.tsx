import { render, screen } from '@testing-library/react';
import { TableProducts } from './tableProducts';
import type { Product } from '../../types/product';

jest.mock('../../api/services/productService', () => ({
  outOfStockProduct: jest.fn(),
  inStockProduct: jest.fn(),
}));

const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Test Product',
    category: 'Test Category',
    unitPrice: 10,
    expirationDate: '2025-01-01',
    inStock: 5,
  },
];

test('renders product name in table', () => {
  render(
    <TableProducts
      products={mockProducts}
      onStockChange={jest.fn()}
      editProduct={jest.fn()}
      deleteProduct={jest.fn()}
      onTableChange={jest.fn()}
      pageCount={1}
      currentPage={0}
    />
  );
  expect(screen.getByText('Test Product')).toBeInTheDocument();
});