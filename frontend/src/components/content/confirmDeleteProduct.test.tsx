import { render, screen, fireEvent, waitFor } from '@testing-library/react';

jest.mock('../../api/client', () => ({
  __esModule: true,
  fetchApi: jest.fn(),
}));

const mockDeleteProduct = jest.fn(() => Promise.resolve());
jest.mock('../../api/services/productService', () => ({
  __esModule: true,
  deleteProduct: mockDeleteProduct,
}));

beforeEach(() => {
  mockDeleteProduct.mockClear();
});

test('calls deleteProduct and onSuccess on submit', async () => {
  const { default: ConfirmDeleteProduct } = await import('./confirmDeleteProduct');

  const mockOnSuccess = jest.fn();
  const product = { id: 123, name: 'Test', category: '', unitPrice: 0, expirationDate: '', inStock: 0 };

  render(<ConfirmDeleteProduct onSuccess={mockOnSuccess} data={product} />);

  fireEvent.click(screen.getByRole('button', { name: /delete/i }));

  await waitFor(() => {
    expect(mockDeleteProduct).toHaveBeenCalledWith(123);
    expect(mockOnSuccess).toHaveBeenCalled();
  });
});