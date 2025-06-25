import React from 'react';
import { useState } from "react";
import type { Product } from "../../types/product";
import { outOfStockProduct, inStockProduct } from "../../api/services/productService";
import { Button } from "../ui/button";
import {
    useReactTable,
    type SortingState,
    type ColumnDef,
    getCoreRowModel,
    getSortedRowModel,
    flexRender
} from "@tanstack/react-table";
import { Card } from "../ui/card";
import editIcon from "../../assets/pencil.png";
import deleteIcon from "../../assets/trash.png";

interface TableProductsProps {
    products: Product[];
    onStockChange: () => Promise<void>;
    editProduct?: (data: Product) => void;
    deleteProduct?: (data: Product) => void;
    onTableChange: ( params: {
        pageIndex: number,
        sortBy1?: string,
        sortDirection1?: string,
        sortBy2?: string,
        sortDirection2?: string,
    }) => void;
    pageCount: number;
    currentPage: number;
}

export function TableProducts({ 
    products, 
    onStockChange, 
    editProduct, 
    deleteProduct,
    onTableChange,
    pageCount,
    currentPage,

}: TableProductsProps) {
    const [loadingId, setLoadingId] = useState<number | null>(null);
    const [sorting, setSorting] = useState<SortingState>([]);

    const handleSort = (columnId: string) => {
        let newSorting: SortingState = [];
        
        const existingSortIndex = sorting.findIndex(sort => sort.id === columnId);
        
        if (existingSortIndex >= 0) {
            const currentSort = sorting[existingSortIndex];
            
            if (!currentSort.desc) {
                newSorting = sorting.map(sort => 
                    sort.id === columnId ? { ...sort, desc: true } : sort
                );
            } else {
                newSorting = sorting.filter(sort => sort.id !== columnId);
                if (existingSortIndex === 0 && newSorting.length > 0) {
                    newSorting = [newSorting[0]];
                }
            }
        } else {
            if (sorting.length >= 2) {
                newSorting = [{ id: columnId, desc: false }, sorting[0]];
            } else {
                newSorting = [...sorting, { id: columnId, desc: false }];
            }
        }

        setSorting(newSorting);
        
        onTableChange({
            pageIndex: 0,
            sortBy1: newSorting[0]?.id,
            sortDirection1: newSorting[0]?.desc ? "desc" : "asc",
            sortBy2: newSorting[1]?.id,
            sortDirection2: newSorting[1]?.desc ? "desc" : "asc",
        });
    };

    const columns: ColumnDef<Product>[] = [
        {
            id: "stockToggle",
            header: "",
            cell: ({row}) => {
                const product = row.original;
                return (
                    <input
                        type="checkbox"
                        checked={product.inStock > 0}
                        disabled={loadingId === product.id}
                        onChange={() => handleStockChange(product)}
                    />
                );
            },
        },
        {
            accessorKey: "category",
            header: "CATEGORY",
        },
        {
            accessorKey: "name",
            header: "NAME",
        },
        {
            accessorKey: "unitPrice",
            header: "UNIT PRICE",
            cell: ({ getValue }) => `$ ${(getValue() as Number).toFixed(2)}`,
        },
        {
            accessorKey: "expirationDate",
            header: "EXPIRATION DATE",
            cell: ({ getValue }) => {
                const value = getValue() as string | null | undefined;
                return value ?? "";
            },
        },
        {
            accessorKey: "inStock",
            header: "IN STOCK",
        },
        {
            id: "actions",
            header: "ACTIONS",
            cell: ({row}) => {
                const product = row.original;
                return (
                    <div className="flex items-center">
                        <Button 
                            className="h-4 border-1 mr-2 font-semibold" 
                            onClick={() => { editProduct && editProduct(product) }}
                        >
                            <img src={editIcon} alt="editIcon" className='w-3 h-3'/>
                            Edit
                        </Button>
                        <Button 
                            className="h-4 border-1 font-semibold"
                            onClick={() => { deleteProduct && deleteProduct(product) }}
                        >
                            <img src={deleteIcon} alt="deleteIcon" className='w-4 h-4'/>
                            Delete
                        </Button>
                    </div>
                );
            },
        },
    ];

    const table = useReactTable({
        data: products,
        columns,
        state: { 
            sorting,
            pagination: {
                pageIndex: currentPage,
                pageSize: 10
            },
        },
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        manualPagination: true,
        manualSorting: true,
        pageCount,
        onSortingChange: () => {},
        onPaginationChange: (updater) => {
            const newPage = typeof updater === "function" 
            ? updater({ pageIndex: currentPage, pageSize: 5})
            : updater;

            onTableChange({
                pageIndex: newPage.pageIndex,
                sortBy1: sorting[0]?.id,
                sortDirection1: sorting[0]?.desc ? "desc" : "asc",
                sortBy2: sorting[1]?.id,
                sortDirection2: sorting[1]?.desc ? "desc" : "asc",
            });
        },
    });

    const handleStockChange = async (product: Product) => {
        setLoadingId(product.id);
        try {
            await (product.inStock > 0 
                ? outOfStockProduct(product.id)
                : inStockProduct(product.id));
        }
        catch (error) {
            console.error('Error changing stock:', error);
        }
        await onStockChange();
        setLoadingId(null);
    }

    return (
        <Card className="mt-5 w-7/10 rounded-sm p-10">
            <div className="text-xl font-bold">Products</div>

            <div className="overflow-x-auto mt-6 border border-gray-400 rounded-sm shadow-sm">
                <table className="w-full divide-y divide-gray-400">
                    <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                                        onClick={() => handleSort(header.column.id)}
                                    >
                                        <div className="flex items-center cursor-pointer">
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                            <span style={{ display: 'inline-block', width: 16, textAlign: 'center' }}>
                                                {{
                                                    asc: " ^",
                                                    desc: " ⌄",
                                                }[header.column.getIsSorted() as string] ?? "\u00A0"}
                                            </span>

                                        </div>
                                    </th>
                                ))}
                        </tr> 
                        ))}
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-300 text-sm rounded-md">
                        {table.getRowModel().rows.map((row) => (
                            <tr key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id} className="px-8 py-2 whitespace-nowrap">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="text-sm flex items-center justify-between mt-2 border border-gray-400 rounded-sm px-7 shadow-sm">
                <div>
                    <span className="text-sm text-gray-700">
                        Page {table.getRowModel().rows.length === 0 ? 0 : currentPage + 1} of {pageCount}
                    </span>
                </div>
                <div className="flex items-center justificy-center space-x-1 h-10">
                    <Button
                        onClick={() => onTableChange({
                        pageIndex: 0,
                        sortBy1: sorting[0]?.id,
                        sortDirection1: sorting[0]?.desc ? "desc" : "asc",
                        sortBy2: sorting[1]?.id,
                        sortDirection2: sorting[1]?.desc ? "desc" : "asc",
                        })}
                        disabled={currentPage === 0}
                        className='h-7 w-7 border border-gray-400'
                    >
                        {"<<"}
                    </Button>
                    <Button
                        onClick={() => onTableChange({
                        pageIndex: currentPage - 1,
                        sortBy1: sorting[0]?.id,
                        sortDirection1: sorting[0]?.desc ? "desc" : "asc",
                        sortBy2: sorting[1]?.id,
                        sortDirection2: sorting[1]?.desc ? "desc" : "asc",
                        })}
                        disabled={currentPage === 0}
                        className='h-7 w-7 border border-gray-400'
                    >
                        {"<"}
                    </Button>
                    <Button
                        onClick={() => onTableChange({
                        pageIndex: currentPage + 1,
                        sortBy1: sorting[0]?.id,
                        sortDirection1: sorting[0]?.desc ? "desc" : "asc",
                        sortBy2: sorting[1]?.id,
                        sortDirection2: sorting[1]?.desc ? "desc" : "asc",
                        })}
                        disabled={currentPage >= pageCount - 1}
                        className='h-7 w-7 border border-gray-400'
                    >
                        {">"}
                    </Button>
                    <Button
                        onClick={() => onTableChange({
                        pageIndex: pageCount - 1,
                        sortBy1: sorting[0]?.id,
                        sortDirection1: sorting[0]?.desc ? "desc" : "asc",
                        sortBy2: sorting[1]?.id,
                        sortDirection2: sorting[1]?.desc ? "desc" : "asc",
                        })}
                        disabled={currentPage >= pageCount - 1}
                        className='h-7 w-7 border border-gray-400'
                    >
                        {">>"}
                    </Button>
                </div>
            </div>

        </Card>
    );
}