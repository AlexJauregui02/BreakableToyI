import React from 'react';
import { render, screen } from '@testing-library/react';
import { MetricsTable } from './metricsTable';

const mockMetrics = [
  {
    category: 'Category1',
    productCount: 5,
    totalValue: 100,
    averagePrice: 20,
  },
  {
    category: 'Overall',
    productCount: 5,
    totalValue: 100,
    averagePrice: 20,
  },
];

test('renders metrics table with correct data', () => {
  render(<MetricsTable metrics={mockMetrics} />);

  expect(screen.getByText('Metrics')).toBeInTheDocument();
  expect(screen.getByText('Category1')).toBeInTheDocument();
  expect(screen.getByText('Overall')).toBeInTheDocument();
  expect(screen.getAllByText('5')).toHaveLength(2);
  expect(screen.getAllByText('$100.00')).toHaveLength(2);
  expect(screen.getAllByText('$20.00')).toHaveLength(2);
});