
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
                        required
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
                <label className='text-sm font-medium'>
                    Expiration Date:
                    <div>
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
                            className="border-1 rounded-sm"
                            dateFormat="yyyy-MM-dd"
                        />
                    </div>
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