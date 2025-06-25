import React from 'react';
import { Button } from '../ui/button';
import { deleteProduct } from '../../api/services/productService';
import type { Product } from '../../types/product';

export default function ConfirmDeleteProduct({
    onSuccess,
    data
}: {
    onSuccess: () => void,
    data?: Product | null
}) {

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (data?.id !== undefined) {
                await deleteProduct(data.id);
            } else {
                throw new Error('Product ID is undefined');
            }
        }
        catch (error) {
            console.error('Error updating product:', error);
        }
        onSuccess();
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4 p-4 items-center">
            <label className='font-semibold'>Are you sure you want to delete this product?</label>
            <Button
                type="submit"
                className="w-1/2 font-bold"
                variant="delete"
            >
                DELETE
            </Button>
        </form>
    );
}