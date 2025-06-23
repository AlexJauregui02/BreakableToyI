
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
            header: () => (
                <input type="checkbox"/>
            ),
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
            accessorKey: "name",
            header: "NAME",
        },
        {
            accessorKey: "category",
            header: "CATEGORY",
        },
        {
            accessorKey: "unitPrice",
            header: "UNIT PRICE",
            cell: ({ getValue }) => `$ ${(getValue() as Number).toFixed(2)}`,
        },
        {
            accessorKey: "expirationDate",
            header: "EXPIRATION DATE",
            cell: ({ getValue }) => new Date(getValue() as string).toLocaleDateString(),
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
                    <>
                        <Button className="h-2 border-1 mr-2" 
                            onClick={() => { editProduct && editProduct(product) }}
                        >
                            Edit
                        </Button>
                        <Button className="h-2 border-1"
                            onClick={() => { deleteProduct && deleteProduct(product) }}
                        >
                            Delete
                        </Button>
                    </>
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
                pageSize: 5
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
        <Card className="m-10 w-7/10 rounded-sm px-5">
            <div className="overflow-x-auto mt-10">
                <table className="divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        onClick={() => handleSort(header.column.id)}
                                    >
                                        <div className="flex items-center cursor-pointer">
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                            {{
                                                asc: " ^",
                                                desc: " ⌄",
                                            }[header.column.getIsSorted() as string] ?? null}

                                        </div>
                                    </th>
                                ))}
                        </tr> 
                        ))}
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-200 text-sm rounded-md">
                        {table.getRowModel().rows.map((row) => (
                            <tr key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id} className="px-6 py-2 whitespace-nowrap">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-between mt-4">
                <div>
                <span className="text-sm text-gray-700">
                    Page {currentPage + 1} of {pageCount}
                </span>
                </div>
                <div className="flex space-x-2">
                <Button
                    onClick={() => onTableChange({
                    pageIndex: 0,
                    sortBy1: sorting[0]?.id,
                    sortDirection1: sorting[0]?.desc ? "desc" : "asc",
                    sortBy2: sorting[1]?.id,
                    sortDirection2: sorting[1]?.desc ? "desc" : "asc",
                    })}
                    disabled={currentPage === 0}
                >
                    First
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
                >
                    Previous
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
                >
                    Next
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
                >
                    Last
                </Button>
                </div>
            </div>

        </Card>
    );
}