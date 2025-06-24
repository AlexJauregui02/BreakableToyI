import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateEditProduct from './createEditProduct';

jest.mock('../../api/services/productService', () => ({
  createProduct: jest.fn(() => Promise.resolve()),
  updateProduct: jest.fn(() => Promise.resolve()),
}));

const categories = ['Category1', 'Category2'];

test('renders form fields and submits new product', async () => {
  const mockOnSuccess = jest.fn();

  render(<CreateEditProduct onSuccess={mockOnSuccess} categories={categories} />);

  fireEvent.change(screen.getByLabelText(/Name:/i), { target: { value: 'Test Product' } });
  fireEvent.change(screen.getByLabelText(/In Stock:/i), { target: { value: '10' } });
  fireEvent.change(screen.getByLabelText(/Unit Price:/i), { target: { value: '99' } });


  const categoryInput = screen.getByRole('combobox');
  await userEvent.type(categoryInput, 'Category1');
  await userEvent.click(screen.getByText('Category1'));

  fireEvent.click(screen.getByRole('button', { name: /Done/i }));

  await waitFor(() => {
    expect(mockOnSuccess).toHaveBeenCalled();
  });
});