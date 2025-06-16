
import type { Product } from "../../types/product";

export function TableProducts({ products }: { products: Product[] }) {

    return (
        <div className="overflow-x-auto mt-10">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiration Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">In Stock</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 text-sm rounded-md">
                    {products.map((product) => (
                        <tr key={product.name}>
                            <td className="px-6 py-2 whitespace-nowrap">{product.name}</td>
                            <td className="px-6 py-2 whitespace-nowrap">{product.category}</td>
                            <td className="px-6 py-2 whitespace-nowrap">{product.unitPrice.toFixed(2)}</td>
                            <td className="px-6 py-2 whitespace-nowrap">{new Date(product.expirationDate).toLocaleDateString()}</td>
                            <td className="px-6 py-2 whitespace-nowrap">{product.inStock}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}