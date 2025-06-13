import './App.css'
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from './components/card'
import { getProducts } from './api/services/productService';
import type { Product } from './types/product';

function App() {
  console.log('App component rendered');

  const productsInitial: Product[] = [
    {
      id: '1',
      name: 'Producto 1',
      category: 'Categoría 1',
      unitPrice: 10.0,
      expiresAt: new Date('2024-12-31'),
      inStock: 100,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-02'),
    }
  ];

  const [products, setProducts] = useState<Product[]>(productsInitial);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        console.log('Fetched products:', response);
        setProducts(response);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  const handleButtonClick = () => {
    console.log('Button clicked');
    alert('Button clicked');
  };

  return (
    <>
      <div className='border-1 border-black flex flex-col items-center justify-center'>
        <Card className='w-1/2 mt-10'>
          hola:
        </Card>
        <div>
          <h1 className='text-2xl font-bold mb-4 border-1 border-black'>Lista de Productos</h1>
          <ul className='list-disc pl-5 border-1 border-black'>
            {products.map(product => (
              <li key={product.id} className='mb-2'>
                {product.name} - {product.category} - ${product.unitPrice.toFixed(2)} - Stock: {product.inStock}
              </li>
            ))}
          </ul>
        </div>

        <CardHeader>
          hola
        </CardHeader>

        <CardTitle className='w-1/2'>
          Hola Mundo
        </CardTitle>

        <CardDescription className='w-1/2 border-1 border-black'>
          Esta es una descripción de ejemplo para el componente Card.
        </CardDescription>

        <button 
          className='bg-blue-500 text-white p-2 rounded mt-4'
          onClick={() => handleButtonClick()}
        >
          Botón de ejemplo
        </button>


      </div>
    </>
  )
}

export default App
