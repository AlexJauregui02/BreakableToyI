import React from 'react';
import { Card } from "../ui/card";

interface MetricProp {
    category: string;
    productCount: number,
    totalValue: number,
    averagePrice: number
}

export function MetricsTable({metrics}: {metrics: MetricProp[]}) {

    return (
        <Card className="m-10 w-7/10 rounded-sm p-10">
            <div className="text-xl font-bold">Metrics</div>
        
            <div className="flex flex-col space-y-4 border-0 w-full mt-4">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"/>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Total products in Stock
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Total value in Stock
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Average price in Stock
                        </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 text-sm">
                        {metrics.map((row) => (
                        <tr key={row.category} className={row.category === 'Overall' ? 'bg-gray-50 font-semibold' : ''}>
                            <td className="px-6 py-2 whitespace-nowrap">{row.category}</td>
                            <td className="px-6 py-2 whitespace-nowrap">{row.productCount}</td>
                            <td className="px-6 py-2 whitespace-nowrap">${row.totalValue.toFixed(2)}</td>
                            <td className="px-6 py-2 whitespace-nowrap">${row.averagePrice.toFixed(2)}</td>
                        </tr>
                        ))}
                    </tbody>
                </table>



            </div>
        </Card>
    );
}