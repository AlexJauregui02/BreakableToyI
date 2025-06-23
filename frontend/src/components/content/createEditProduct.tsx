
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { createProduct, updateProduct } from '../../api/services/productService';
import CreatableSelect from 'react-select/creatable';
import type { Product } from '../../types/product';

export default function CreateEditProduct({
    onSuccess,
    data,
    categories = []
}: {
    onSuccess: () => void,
    data?: Product | null,
    categories: string[]
}) {
    const categoryOptions = categories.map(val => ({ value: val, label: val }));

    const [formData, setFormData] = useState({
        name: data?.name || '',
        category: data?.category || '',
        expirationDate: data?.expirationDate,
        unitPrice: data?.unitPrice?.toString() || '',
        inStock: data?.inStock?.toString() || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleCategoryChange = (selected: any) => {
        setFormData({
            ...formData,
            category: selected ? selected.value : '',
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        let productData;

        if (data?.id && data.id > 0) {
            productData = {
                ...formData,
                id: data.id,
                expirationDate: formData.expirationDate ? new Date(formData.expirationDate) : new Date(),
                unitPrice: Number(formData.unitPrice),
                inStock: Number(formData.inStock),
            };
            try {
                await updateProduct(productData);
            }
            catch (error) {
                console.error('Error updating product:', error);
            }
        } else {
            try {
                productData = {
                    ...formData,
                    id: 0,
                    expirationDate: formData.expirationDate ? new Date(formData.expirationDate) : new Date(),
                    unitPrice: Number(formData.unitPrice),
                    inStock: Number(formData.inStock),
                };
                await createProduct(productData);
            } catch (error) {
                console.error('Error submitting form:', error);
            }
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
                    <CreatableSelect
                        isClearable
                        options={categoryOptions}
                        value={
                            formData.category
                                ? { value: formData.category, label: formData.category }
                                : null
                        }
                        onChange={handleCategoryChange}
                        className="mx-1 text-sm shadow-sm"
                        classNamePrefix="select"
                        placeholder="Select or create a category"
                    />
                </label>
                <label className='text-sm font-medium leading-none'>
                    In Stock:
                    <input
                        type="number"
                        name="inStock"
                        value={formData.inStock}
                        onChange={handleChange}
                        className="mx-1 h-7 rounded-sm border border-input px-3 py-1 text-sm shadow-sm"
                        min={0}
                        max={100000}
                        required
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
                <label className='text-sm font-medium leading-none'>
                    Expiration Date:
                    <input
                        type="date"
                        name="expirationDate"
                        value={
                            formData.expirationDate instanceof Date
                                ? formData.expirationDate.toISOString().slice(0, 10)
                                : formData.expirationDate || ''
                        }
                        onChange={handleChange}
                        className="mx-1 h-7 rounded-sm border border-input px-3 py-1 text-sm shadow-sm"
                    />
                </label>
            </div>
            <Button
                type="submit"
                className="w-full"
                variant="default"
            >
                Done
            </Button>
        </form>
    );
}