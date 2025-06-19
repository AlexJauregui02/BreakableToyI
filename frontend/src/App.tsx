import './App.css'
import { useEffect, useState } from 'react';
import { getProducts, getMetrics } from './api/services/productService';
import type { Product } from './types/product';
import { Button } from './components/ui/button';
import { Modal } from './components/ui/modal';
import CreateEditProduct from './components/content/createEditProduct';
import { TableProducts } from './components/ui/tableProducts';
import { MetricsTable } from './components/content/metricsTable';
import ConfirmDeleteProduct from './components/content/confirmDeleteProduct';
import FilterProducts from './components/content/filterProducts';

type ModalType = 'create' | 'update' | 'delete' | null;

export default function App() {

  const [nameFilter, setNameFilter] = useState<String>('');
  const [categoryFilter, setCategoryFilter] = useState<String>('');
  const [availabilityFilter, setAvailabilityFilter] = useState<String>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [metrics, setMetrics] = useState([]);
  const [currentModal, setCurrentModal] = useState<ModalType>(null);
  const [tempProduct, setTempProduct] = useState<Product | null>(null);

  const openModal = (type: ModalType, data?: Product) => {
    if ((type === 'update' || type === 'delete') && data) {
      setTempProduct(data);
    }
    setCurrentModal(type);
  };

  const closeModal = () => {
    setCurrentModal(null);
    setTempProduct(null);
  };

  const fetchProducts = async (
    name = nameFilter,
    category = categoryFilter,
    availability = availabilityFilter
  ) => {
    try {
      const response = await getProducts(name,category,availability);
      setProducts(response?.content ?? []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }

    try {
      const response = await getMetrics();
      setMetrics(response ?? []);
      console.log(metrics);
    } catch (error) {
      console.error('Error fetching metrics:', error)
    }
  };

  const handleFilters = async (name: String, category: String, availability: String) => {
    setNameFilter(name);
    setCategoryFilter(category);
    setAvailabilityFilter(availability);
    await fetchProducts(name, category, availability);
  };

  const modalContents = {
    create: {
      title: 'Create Product',
      description: 'Create a new product.',
      content: <CreateEditProduct 
                  onSuccess={() =>{
                    fetchProducts();
                    closeModal();
                  }}/>,
      size: 'md'
    },
    update: {
      title: 'Update Product',
      description: 'Update an existing product.',
      content: <CreateEditProduct 
                  onSuccess={() =>{
                    fetchProducts();
                    closeModal();
                  }} 
                  data={tempProduct}/>,
      size: 'md'
    },
    delete: {
      title: 'Delete Product',
      description: '',
      content: <ConfirmDeleteProduct
                  onSuccess={() =>{
                    fetchProducts();
                    closeModal();
                  }} 
                  data={tempProduct}/>,
      size: 'md'
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      <div className='flex flex-col items-center justify-center'>

        <FilterProducts
          filterSearch={(name, category, size) => {handleFilters(name, category, size)}}
        />

        <Button 
          className='mx-15 mt-10' 
          variant='outline' 
          onClick={() => {openModal('create')}}
        >
          New Product
        </Button>

        <TableProducts 
          products={products} 
          onStockChange={fetchProducts} 
          editProduct={(data) => openModal('update', data)}
          deleteProduct={(data) => openModal('delete', data)}
        />

        <MetricsTable
          metrics={metrics}
        />

        {currentModal && (
          <Modal
            isOpen={!!currentModal}
            onClose={closeModal}
            title={modalContents[currentModal].title}
            description={modalContents[currentModal].description}
            size='md'
          >
            {modalContents[currentModal].content}

          </Modal>
        )}

      </div>
    </>
  )
}
