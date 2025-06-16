import { fetchApi } from "../client";
import type { Product } from "../../types/product";

export async function getProducts(): Promise<Product[]> {
    return fetchApi<Product[]>("/products");
}

export async function createProduct(product: Product): Promise<Product> {
    const response = await fetchApi<Product>("/products", {
        method: "POST",
        body: JSON.stringify(product),
    });
    return response;
}

export async function updateProduct(product: Product): Promise<Product> {
    const response = await fetchApi<Product>(`/products/${product.id}`, {
        method: "PUT",
        body: JSON.stringify(product),
    });
    return response;
}

export async function outOfStockProduct(productId: string): Promise<Product> {
    const response = await fetchApi<Product>(`/products/${productId}/outofstock`, {
        method: "POST",
    });
    return response;
}

export async function inStockProduct(productId: string): Promise<Product> {
    const response = await fetchApi<Product>(`/products/${productId}/instock`, {
        method: "PUT",
    });
    return response;
}

