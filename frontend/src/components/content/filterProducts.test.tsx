import { render, screen, fireEvent } from '@testing-library/react';
import FilterProducts from './filterProducts';

const categories = ['Category1', 'Category2'];

test('renders filter inputs and calls Search click', () => {
  const mockFilterSearch = jest.fn();

  render(<FilterProducts filterSearch={mockFilterSearch} categories={categories} />);

  fireEvent.change(screen.getByLabelText(/Name:/i), { target: { value: 'TestName' } });

  fireEvent.click(screen.getByText(/Search/i));

  expect(mockFilterSearch).toHaveBeenCalledWith('TestName', [], '');
});