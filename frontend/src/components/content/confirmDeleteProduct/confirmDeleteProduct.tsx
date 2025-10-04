import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { deleteProduct } from "@/api/services/productService";
import type { ProductCRUDProps } from "@/types/product";

export default function ConfirmDeleteProduct({
  onSuccess,
  data,
}: ProductCRUDProps) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      await deleteProduct(data!.id);
      onSuccess();
    } catch (error) {
      console.error("Error deleting product:", error);
      setErrorMsg("Failed to delete product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col space-y-4 p-4 items-center"
    >
      <label className="font-semibold text-center">
        Are you sure you want to delete{" "}
        <span className="font-bold">{data?.name}</span>?
      </label>

      {errorMsg && <p className="text-sm text-red-500">{errorMsg}</p>}

      <Button type="submit" className="w-1/2 font-bold" variant="delete">
        {loading ? "Deleting..." : "DELETE"}
      </Button>
    </form>
  );
}
