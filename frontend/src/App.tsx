import './App.css'
import { useEffect, useState } from 'react';
import { getProducts, getMetrics, getCategories } from './api/services/productService';
import type { Product, getProductProps } from './types/product';
import { Button } from './components/ui/button';
import { Modal } from './components/ui/modal';
import CreateEditProduct from './components/content/createEditProduct';
import { TableProducts } from './components/content/tableProducts';
import { MetricsTable } from './components/content/metricsTable';
import ConfirmDeleteProduct from './components/content/confirmDeleteProduct';
import FilterProducts from './components/content/filterProducts';
import { Card } from '@mui/material';

type ModalType = 'create' | 'update' | 'delete' | null;

export default function App() {

  const [products, setProducts] = useState<Product[]>([]);
  const [metrics, setMetrics] = useState([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [currentModal, setCurrentModal] = useState<ModalType>(null);
  const [tempProduct, setTempProduct] = useState<Product | null>(null);
  const [totalItems, setTotalItems] = useState(0);

  const [getDataProps, setGetDataProps] = useState<getProductProps>({
    name: "",
    category: [],
    availability: "",
    sortBy1: "",
    sortDirection1: "",
    sortBy2: "",
    sortDirection2: "",
    page: 0,
    size: 10
});

  const openModal = (type: ModalType, data?: Product) => {
    if (categories.length === 0) {
      fetchProducts().then(() => setCurrentModal(type));
    } else {
      setCurrentModal(type);
    }

    if ((type === 'update' || type === 'delete') && data) {
      setTempProduct(data);
    }
  };

  const closeModal = () => {
    setCurrentModal(null);
    setTempProduct(null);
  };

  const fetchProducts = async (
    data = getDataProps
  ) => {
    try {
      const response = await getProducts(data);
      setProducts(response?.content ?? []);
      setTotalItems(response?.totalElements ?? 0);
    } catch (error) {
      console.error('Error fetching products:', error);
    }

    try {
      const response = await getMetrics();
      setMetrics(response ?? []);
    } catch (error) {
      console.error('Error fetching metrics:', error)
    }

    try {
      const response = await getCategories();
      setCategories(response ?? []);
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  };

  const handleFilters = async (name: string, categories: string[], availability: string) => {
    const newProps: getProductProps = {
      ...getDataProps,
      name,
      category: categories,
      availability,
      page: 0,
    };
    setGetDataProps(newProps);
  };

  const modalContents = {
    create: {
      title: 'Create Product',
      description: 'Create a new product.',
      content: <CreateEditProduct 
                  onSuccess={() =>{
                    fetchProducts();
                    closeModal();
                  }}
                  categories={categories}/>,
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
                  data={tempProduct}
                  categories={categories}/>,
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
  }, [
    getDataProps.name,
    getDataProps.category,
    getDataProps.availability,
    getDataProps.sortBy1,
    getDataProps.sortDirection1,
    getDataProps.sortBy2,
    getDataProps.sortDirection2,
    getDataProps.page,
    getDataProps.size,
  ]);

  return (
    <>
      <div className='flex flex-col items-center justify-center'>

        <FilterProducts
          filterSearch={(name, categories, size) => {handleFilters(name, categories, size)}}
          categories={categories}
        />

        <div className='flex justify-start w-7/10'>
          <Button
            className='shadow-sm' 
            variant='outline' 
            onClick={() => {openModal('create')}}
          >
            New Product
          </Button>
        </div>

        <TableProducts 
          products={products} 
          onStockChange={fetchProducts} 
          editProduct={(data) => openModal('update', data)}
          deleteProduct={(data) => openModal('delete', data)}
          onTableChange={(params) => {
            setGetDataProps(prev => ({
              ...prev,
              ...params,
              page: params.pageIndex ?? 0,
            }));
          }}
          pageCount={Math.ceil(totalItems / getDataProps.size)}
          currentPage={getDataProps.page}
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
