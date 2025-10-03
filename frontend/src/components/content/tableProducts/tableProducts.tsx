import type { Product, TableProductsProps } from "@/types/product";
import { Button } from "@/components/ui/button";
import {
  useReactTable,
  type ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Card } from "@/components/ui/card";
import editIcon from "@/assets/pencil.png";
import deleteIcon from "@/assets/trash.png";

import { useTableSorting } from "@/lib/useTableSorting";
import { useStockHandler } from "@/lib/useStockHandler";

export function TableProducts({
  products,
  onStockChange,
  editProduct,
  deleteProduct,
  onTableChange,
  pageCount,
  currentPage,
}: TableProductsProps) {
  const { sorting, handleSort, updateTable } = useTableSorting(onTableChange);
  const { loadingId, handleStockChange } = useStockHandler(onStockChange);

  const columns: ColumnDef<Product>[] = [
    {
      id: "stockToggle",
      header: "",
      cell: ({ row }) => {
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
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="flex items-center">
            <Button
              className="h-4 border-1 mr-2 font-semibold"
              onClick={() => {
                editProduct && editProduct(product);
              }}
            >
              <img src={editIcon} alt="editIcon" className="w-3 h-3" />
              Edit
            </Button>
            <Button
              className="h-4 border-1 font-semibold"
              onClick={() => {
                deleteProduct && deleteProduct(product);
              }}
            >
              <img src={deleteIcon} alt="deleteIcon" className="w-4 h-4" />
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
        pageSize: 10,
      },
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    manualSorting: true,
    pageCount,
    onSortingChange: () => {},
    onPaginationChange: (updater) => {
      const newPage =
        typeof updater === "function"
          ? updater({ pageIndex: currentPage, pageSize: 5 })
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
                        header.getContext(),
                      )}
                      <span
                        style={{
                          display: "inline-block",
                          width: 16,
                          textAlign: "center",
                        }}
                      >
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
            Page {table.getRowModel().rows.length === 0 ? 0 : currentPage + 1}{" "}
            of {pageCount}
          </span>
        </div>
        <div className="flex items-center justificy-center space-x-1 h-10">
          <Button
            onClick={() => updateTable(0)}
            disabled={currentPage === 0}
            className="h-7 w-7 border border-gray-400"
          >
            {"<<"}
          </Button>
          <Button
            onClick={() => updateTable(currentPage - 1)}
            disabled={currentPage === 0}
            className="h-7 w-7 border border-gray-400"
          >
            {"<"}
          </Button>
          <Button
            onClick={() => updateTable(currentPage + 1)}
            disabled={currentPage >= pageCount - 1}
            className="h-7 w-7 border border-gray-400"
          >
            {">"}
          </Button>
          <Button
            onClick={() => updateTable(pageCount - 1)}
            disabled={currentPage >= pageCount - 1}
            className="h-7 w-7 border border-gray-400"
          >
            {">>"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
