import { fetchApi } from "../client";
import type { Product } from "../../types/product";

export async function getProducts(): Promise<Product[]> {
    return fetchApi<Product[]>("/products");
}