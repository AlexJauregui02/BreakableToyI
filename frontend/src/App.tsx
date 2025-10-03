import "./App.css";
import { useCallback, useEffect, useState } from "react";
import {
  getProducts,
  getMetrics,
  getCategories,
} from "./api/services/productService";
import type { Product, getProductProps, MetricProp } from "./types/product";
import { Button } from "./components/ui/button";
import { Modal } from "./components/ui/modal";
import CreateEditProduct from "./components/content/createEditProduct/createEditProduct";
import { TableProducts } from "./components/content/tableProducts/tableProducts";
import { MetricsTable } from "./components/content/metricsTable/metricsTable";
import ConfirmDeleteProduct from "./components/content/confirmDeleteProduct/confirmDeleteProduct";
import FilterProducts from "./components/content/filterProducts/filterProducts";

type ModalType = "create" | "update" | "delete" | null;

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [metrics, setMetrics] = useState<MetricProp[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [currentModal, setCurrentModal] = useState<ModalType>(null);
  const [tempProduct, setTempProduct] = useState<Product | null>(null);
  const [totalItems, setTotalItems] = useState(0);

  const [getDataProps, setGetDataProps] = useState<getProductProps>({
    name: "",
    category: [],
    availability: "",
    sortBy1: "",
    sortDirection1: "",
    sortBy2: "",
    sortDirection2: "",
    page: 0,
    size: 10,
  });

  const fetchProducts = useCallback(async (data = getDataProps) => {
    try {
      const [resProducts, resMetrics, resCategories] = await Promise.all([
        getProducts(data),
        getMetrics(),
        getCategories(),
      ]);

      setProducts(resProducts?.content ?? []);
      setTotalItems(resProducts?.totalElements ?? 0);
      setMetrics(resMetrics ?? []);
      setCategories(resCategories ?? []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [getDataProps]);

  const openModal = (type: ModalType, data?: Product) => {
    if (categories.length === 0) {
      getCategories().then((res) => {
        setCategories(res ?? []);
        setCurrentModal(type);
      });
    } else {
      setCurrentModal(type);
    }

    if ((type === "update" || type === "delete") && data) {
      setTempProduct(data);
    }
  };

  const closeModal = () => {
    setCurrentModal(null);
    setTempProduct(null);
  };

  const handleFilters = async (
    name: string,
    categories: string[],
    availability: string,
  ) => {
    setGetDataProps((prev) => ({
      ...prev,
      name,
      category: categories,
      availability,
      page: 0,
    }));
  };

  const modalContents = {
    create: {
      title: "Create Product",
      description: "Create a new product.",
      content: (
        <CreateEditProduct
          onSuccess={() => {
            fetchProducts();
            closeModal();
          }}
          categories={categories}
        />
      ),
      size: "md",
    },
    update: {
      title: "Update Product",
      description: "Update an existing product.",
      content: (
        <CreateEditProduct
          onSuccess={() => {
            fetchProducts();
            closeModal();
          }}
          data={tempProduct}
          categories={categories}
        />
      ),
      size: "md",
    },
    delete: {
      title: "Delete Product",
      description: "",
      content: (
        <ConfirmDeleteProduct
          onSuccess={() => {
            fetchProducts();
            closeModal();
          }}
          data={tempProduct}
        />
      ),
      size: "md",
    },
  };

  useEffect(() => {
    fetchProducts();
  }, [getDataProps, fetchProducts]);

  return (
    <>
      <div className="flex flex-col items-center justify-center bg-gray-100">
        <FilterProducts
          filterSearch={(name, categories, size) => {
            handleFilters(name, categories, size);
          }}
          categories={categories}
        />

        <div className="flex justify-start w-7/10">
          <Button
            variant="filled"
            size="lg"
            onClick={() => {
              openModal("create");
            }}
          >
            New Product
          </Button>
        </div>

        <TableProducts
          products={products}
          onStockChange={fetchProducts}
          editProduct={(data) => openModal("update", data)}
          deleteProduct={(data) => openModal("delete", data)}
          onTableChange={(params) => {
            setGetDataProps((prev) => ({
              ...prev,
              ...params,
              page: params.pageIndex ?? 0,
            }));
          }}
          pageCount={Math.ceil(totalItems / getDataProps.size)}
          currentPage={getDataProps.page}
        />

        <MetricsTable metrics={metrics} />

        {currentModal && (
          <Modal
            isOpen={!!currentModal}
            onClose={closeModal}
            title={modalContents[currentModal].title}
            description={modalContents[currentModal].description}
            size="md"
          >
            {modalContents[currentModal].content}
          </Modal>
        )}
      </div>
    </>
  );
}
