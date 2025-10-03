import { useState, useCallback } from "react";
import type { Product } from "@/types/product";
import { outOfStockProduct, inStockProduct } from "@/api/services/productService";

export function useStockHandler(onStockChange: () => Promise<void>) {
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const handleStockChange = useCallback(
    async (product: Product) => {
      setLoadingId(product.id);
      try {
        await (product.inStock > 0
          ? outOfStockProduct(product.id)
          : inStockProduct(product.id));
      } catch (err) {
        console.error(err);
      }
      await onStockChange();
      setLoadingId(null);
    },
    [onStockChange]
  );

  return { loadingId, handleStockChange };
}
