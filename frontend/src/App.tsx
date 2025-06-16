import './App.css'
import { useEffect, useState } from 'react';
import { Card } from './components/ui/card'
import { getProducts } from './api/services/productService';
import type { Product } from './types/product';
import { Button } from './components/ui/button';
import { Modal } from './components/ui/modal';
import AddNewProduct from './components/content/addNewProduct';
import { TableProducts } from './components/ui/tableProducts';

type ModalType = 'create' | 'update' | null;

export default function App() {

  const [products, setProducts] = useState<Product[]>([]);
  const [currentModal, setCurrentModal] = useState<ModalType>(null);

  const openModal = (type: ModalType) => setCurrentModal(type);
  const closeModal = () => setCurrentModal(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const modalContents = {
    create: {
      title: 'Create Product',
      description: 'Create a new product.',
      content: <AddNewProduct 
                  onSuccess={() =>{
                    fetchProducts();
                    closeModal();
                  }}/>,
      size: 'md'
    },
    update: {
      title: 'Update Product',
      description: 'Update an existing product.',
      content: <div>Update Product Form</div>,
      size: 'md'
    }
  };

  const fetchProducts = async () => {
      try {
        const response = await getProducts();
        console.log('Fetched products:', response);
        setProducts(response);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

  return (
    <>
      <div className='flex flex-col items-center justify-center'>
        <Card className='w-1/2 mt-10'>
          <Button className='mx-15' variant='outline' onClick={() => {openModal('create')}}>
            New Product
          </Button>
        </Card>

        <TableProducts products={products} />

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
