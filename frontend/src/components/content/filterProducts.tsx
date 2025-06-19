
import { useState } from "react";

import { Card } from "../ui/card";
import { Button } from "../ui/button";

export default function FilterProducts({
    filterSearch
}: {
    filterSearch: (name: String, category: String, availability: String) => void
}) {

    const [name, setName] = useState<String>('');
    const [category, setCategory] = useState<String>('');
    const [availability, setAvailability] = useState<String>('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        if (id === "name") setName(value);
        else if (id === "category") setCategory(value);
        else if (id === "availability") setAvailability(value);
    }

    const handleFilterSearch = () => {
        console.log(`${name} | ${category} | ${availability}`);
        filterSearch(name, category, availability);
    }

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
                            onChange={handleChange}
                        />
                    </label>
                    <label className='text-sm font-medium leading-none'>
                        Category:
                        <select
                            id="category"
                            className="appearance-none mx-1 h-7 px-2 rounded-sm border-1 text-sm "
                            onChange={handleChange}
                        >
                            <option value=''>Select a category</option>
                        </select>
                    </label>
                    <label className='text-sm font-medium leading-none'>
                        Availability:
                        <select
                            id="availability"
                            className="appearance-none mx-1 h-7 px-2 rounded-sm border-1 text-sm "
                            onChange={handleChange}
                        >
                            <option value=''>Select an availability</option>
                        </select>
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