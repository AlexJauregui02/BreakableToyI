import React from 'react';
import { useState } from "react";

import { Card } from "../ui/card";
import { Button } from "../ui/button";

import Select from 'react-select';

export default function FilterProducts({
    filterSearch,
    categories = []
}: {
    filterSearch: (name: string, category: string[], availability: string) => void,
    categories: string[]
}) {

    const [name, setName] = useState<string>('');
    const [category, setCategory] = useState<string[]>([]);
    const [availability, setAvailability] = useState<string>('');

    // This is because the select react componente only accepts value and label as the 
    // order of the input
    const categoryOptions = categories.map(val => ({ value: val, label: val }));
    const availabilityOptions = [
        { value: '', label: 'Select...' },
        { value: 'in_stock', label: 'In Stock' },
        { value: 'out_of_stock', label: 'Out Of Stock' },
    ];

    const handleChangeName = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { value } = e.target;
        setName(value);
    };

    const handleCategoryChange = (selected: any) => {
        setCategory(selected ? selected.map((opt: any) => opt.value) : []);
    };

    const handleAvailabilityChange = (selected: any) => {
        setAvailability(selected.value);
    }

    const handleFilterSearch = () => {
        filterSearch(name, category, availability);
    };

    return (
        <Card className="m-10 w-7/10 rounded-sm p-10">
            <div className="text-xl font-bold">Select a Filter</div>
        
            <div className="flex flex-col space-y-4 border-0 w-1/2 mt-4">
                <div className="flex flex-col space-y-2 grid grid-col-3">
                    <label className='text-sm font-medium leading-none'>
                        Name:
                        <input
                            id="name"
                            type="text"
                            className="mx-1 h-7 rounded-sm border border-input px-3 py-1 text-sm shadow-sm"
                            onChange={handleChangeName}
                        />
                    </label>
                    <label className='text-sm font-medium leading-none'>
                        Category:
                        <Select
                            isMulti
                            id="category"
                            options={categoryOptions}
                            value={categoryOptions.filter(opt => category.includes(opt.value))}
                            onChange={handleCategoryChange}
                            unstyled
                            className="mx-1 px-2 rounded-sm border-1 text-sm shadow-sm"
                            classNamePrefix="select"
                        />
                    </label>
                    <label className='text-sm font-medium leading-none'>
                        Availability:
                        <Select
                            options={availabilityOptions}
                            id="availability"
                            className="mx-1 px-2 rounded-sm border-1 text-sm shadow-sm"
                            unstyled
                            onChange={handleAvailabilityChange}
                        />
                    </label>
                </div>
                <Button
                    className="w-full border-1"
                    variant="default"
                    onClick={handleFilterSearch}
                >
                    Search
                </Button>
            </div>
        </Card>
    );
}