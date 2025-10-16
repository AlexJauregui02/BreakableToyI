import { fetchApi } from "../client";
import type { Product, CustomPage, getProductProps } from "@/types/product";

export async function getProducts(
  data: getProductProps,
): Promise<CustomPage<Product> | undefined> {
  try {
    let url = `/products?page=${data.page}&size=${data.size}`;

    if (data.name) {
      url += `&name=${data.name}`;
    }
    if (data.category.length > 0) {
      data.category.forEach((category) => {
        url += `&category=${category}`;
      });
    }
    if (data.availability) {
      url += `&availability=${data.availability}`;
    }
    if (data.sortBy1) {
      url += `&sortBy1=${data.sortBy1}&sortDirection1=${data.sortDirection1}`;
      if (data.sortBy2) {
        url += `&sortBy2=${data.sortBy2}&sortDirection2=${data.sortDirection2}`;
      }
    }
    return fetchApi<CustomPage<Product>>(url);
  } catch (error) {
    console.error("Error fetching products:", error);
    return undefined;
  }
}

export async function createProduct(
  product: Product,
): Promise<Product | undefined> {
  try {
    const response = await fetchApi<Product>("/products", {
      method: "POST",
      body: JSON.stringify(product),
    });
    return response;
  } catch (error) {
    console.error("Error creating product:", error);
    return undefined;
  }
}

export async function updateProduct(
  product: Product,
): Promise<Product | undefined> {
  try {
    const response = await fetchApi<Product>(`/products/${product.id}`, {
      method: "PUT",
      body: JSON.stringify(product),
    });
    return response;
  } catch (error) {
    console.error("Error updating product:", error);
    return undefined;
  }
}

export async function outOfStockProduct(
  productId: number,
): Promise<Product | undefined> {
  try {
    const response = await fetchApi<Product>(
      `/products/${productId}/outofstock`,
      {
        method: "POST",
        body: null,
      },
    );
    return response;
  } catch (error) {
    console.error("Error marking product as out of stock:", error);
    return undefined;
  }
}

export async function inStockProduct(
  productId: number,
): Promise<Product | undefined> {
  try {
    const response = await fetchApi<Product>(`/products/${productId}/inStock`, {
      method: "PUT",
      body: null,
    });
    return response;
  } catch (error) {
    console.error("Error marking product as in stock:", error);
    return undefined;
  }
}

export async function deleteProduct(
  productId: number,
): Promise<Product | undefined> {
  try {
    const response = await fetchApi<Product>(`/products/${productId}`, {
      method: "DELETE",
      body: null,
    });
    return response;
  } catch (error) {
    console.error("Error deleting product:", error);
    return undefined;
  }
}

export async function getMetrics(): Promise<[] | undefined> {
  try {
    return fetchApi<[]>("/products/metrics");
  } catch (error) {
    console.error("Error fetching metrics:", error);
    return undefined;
  }
}

export async function getCategories(): Promise<[] | undefined> {
  try{
    return fetchApi<[]>("/products/categories");
  } catch (error) {
    console.error("Error fetching categories:", error);
    return undefined;
  }
}
