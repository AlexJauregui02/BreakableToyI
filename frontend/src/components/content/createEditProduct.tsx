import React from 'react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { createProduct, updateProduct } from '../../api/services/productService';
import CreatableSelect from 'react-select/creatable';
import type { Product } from '../../types/product';
import DatePicker from 'react-datepicker';

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
        expirationDate: data?.expirationDate || null,
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

        const productData = {
            ...formData,
            id: data?.id && data.id > 0 ? data.id : 0,
            expirationDate: formData.expirationDate,
            unitPrice: Number(formData.unitPrice),
            inStock: Number(formData.inStock),
        };

        try {
            if (data?.id && data.id > 0) {
                await updateProduct(productData);
            } else {
                await createProduct(productData);
            }
            onSuccess();
        }
        catch (error) {
            console.error('Error updating product:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4">
            <div className="space-y-2 text-sm">
                <div className='grid grid-cols-2'>
                    <div>
                        <label className='text-sm font-medium leading-none'>
                            Name:
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="mx-1 h-7 rounded-sm border border-input px-3 py-1 text-sm shadow-sm"
                            required
                        />
                    </div>
                    <div className='grid grid-cols-2 gap-5 w-full'>
                        <div className='w-full'>
                            <label className='text-sm font-medium leading-none'>
                                In Stock:
                            </label>
                            <input
                                type="number"
                                name="inStock"
                                value={formData.inStock}
                                onChange={handleChange}
                                className="h-7 w-full rounded-sm border border-input px-3 py-1 text-sm shadow-sm"
                                min={0}
                                max={100000}
                                required
                            />
                        </div>
                        <div>
                            <label className='text-sm font-medium leading-none'>
                                Unit Price:
                            </label> 
                            <input
                                type="number"
                                name="unitPrice"
                                value={formData.unitPrice}
                                onChange={handleChange}
                                className="h-7 w-full rounded-sm border border-input px-3 py-1 text-sm shadow-sm"
                                min={0}
                                max={100000}
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className='grid grid-cols-2 gap-5 text-sm w-full max-w-xl'>
                    <div>
                        <label className='text-sm font-medium leading-none'>
                            Category:
                        </label>
                        <CreatableSelect
                            isClearable
                            options={categoryOptions}
                            value={
                                formData.category
                                    ? { value: formData.category, label: formData.category }
                                    : null
                            }
                            required
                            unstyled
                            onChange={handleCategoryChange}
                            classNames={{
                                control: () => 'px-2 rounded-sm border shadow-sm',
                                option: () => `bg-white rounded-sm pl-2`,
                                menu: () => 'bg-white border-1 rounded-sm',
                            }}
                            styles={{
                                control: (base) => ({
                                    ...base,
                                    minHeight: '33px',
                                    width: '100%'
                                })
                            }}
                            classNamePrefix="select"
                            placeholder="Select/Create a category"
                        />
                    </div>
                    <div className='w-full'>
                        <label className='font-medium'>
                            Expiration Date:
                        </label>
                        <DatePicker
                            showIcon
                            selected={formData.expirationDate ? new Date(formData.expirationDate + "T00:00:00") : null}
                            onChange={(date: Date | null) =>
                                setFormData({
                                    ...formData,
                                    expirationDate: date
                                        ? date.getFullYear() +
                                        '-' +
                                        String(date.getMonth() + 1).padStart(2, '0') +
                                        '-' +
                                        String(date.getDate()).padStart(2, '0')
                                        : null
                                })
                            }
                            className="border-1 rounded-sm w-full"
                            dateFormat="dd-MM-yyyy"
                        />
                    </div>
                </div>
            </div>

            <Button
                type="submit"
                className="w-1/2 "
                variant="filled"
            >
                Done
            </Button>
        </form>
    );
}