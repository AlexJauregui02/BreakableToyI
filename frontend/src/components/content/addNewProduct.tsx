
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { createProduct } from '../../api/services/productService';

export default function AddNewProduct({onSuccess}: {onSuccess: () => void}) {
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        expirationDate: '',
        unitPrice: '',
        inStock: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const productData = {
                ...formData,
                expirationDate: new Date(formData.expirationDate),
                unitPrice: Number(formData.unitPrice),
                inStock: Number(formData.inStock),
            };
            await createProduct(productData);
        } catch (error) {
            console.error('Error submitting form:', error);
        }
        onSuccess();
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4 p-4">
            <div className="flex flex-col space-y-2">
                <label className='text-sm font-medium leading-none'>
                    Name:
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="mx-1 h-7 rounded-sm border border-input px-3 py-1 text-sm shadow-sm"
                        required
                    />
                </label>

                <label className='text-sm font-medium leading-none'>
                    Category:
                    <input
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="mx-1 h-7 rounded-sm border border-input px-3 py-1 text-sm shadow-sm"
                        required
                    />
                </label>
                <label className='text-sm font-medium leading-none'>
                    Expiration Date:
                    <input
                        type="date"
                        name="expirationDate"
                        value={formData.expirationDate}
                        onChange={handleChange}
                        className="mx-1 h-7 rounded-sm border border-input px-3 py-1 text-sm shadow-sm"
                    />
                </label>
                <label className='text-sm font-medium leading-none'>
                    Unit Price:
                    <input
                        type="number"
                        name="unitPrice"
                        value={formData.unitPrice}
                        onChange={handleChange}
                        className="mx-1 h-7 rounded-sm border border-input px-3 py-1 text-sm shadow-sm"
                        min={0}
                        max={100000}
                        required
                    />
                </label>
            </div>
            <Button
                type="submit"
                className="w-full"
                variant="default"
            >
                Create Product
            </Button>
        </form>
    );
}