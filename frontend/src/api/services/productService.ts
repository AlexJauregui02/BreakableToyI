import { fetchApi } from "../client";
import type { Product, CustomPage } from "../../types/product";

export async function getProducts(name: String, page: String, size: String): Promise<CustomPage<Product> | undefined> {
    return fetchApi<CustomPage<Product>>(`/products?name=${name}&page=${page}&size=${size}`);
}

export async function createProduct(product: Product): Promise<Product | undefined> {
    const response = await fetchApi<Product>("/products", {
        method: "POST",
        body: JSON.stringify(product),
    });
    return response;
}

export async function updateProduct(product: Product): Promise<Product | undefined> {
    const response = await fetchApi<Product>(`/products/${product.id}`, {
        method: "PUT",
        body: JSON.stringify(product),
    });
    return response;
}

export async function outOfStockProduct(productId: number): Promise<Product | undefined> {
    const response = await fetchApi<Product>(`/products/${productId}/outofstock`, {
        method: "POST",
        body: null,
    });
    return response;
}

export async function inStockProduct(productId: number): Promise<Product | undefined> {
    const response = await fetchApi<Product>(`/products/${productId}/inStock`, {
        method: "PUT",
        body: null,
    });
    return response;
}

export async function deleteProduct(productId: number): Promise<Product | undefined> {
    const response = await fetchApi<Product>(`/products/${productId}`, {
        method: "DELETE",
        body: null,
    });
    return response;
}
