package com.example.service;

import java.util.List;

import com.example.models.MetricRow;
import com.example.models.Product;
import com.example.models.ProductPage;

public interface ProductServiceInterface {
    ProductPage getProducts(String name, List<String> categories, Boolean availability,
                                           String sortBy1, String sortDirection1, String sortBy2, String sortDirection2,
                                           int page, int size);
    Product createProduct(Product product);
    Product updateProduct(Product product);
    void productOutOfStock(Long id);
    void productInStock(Long id);
    void productDelete(Long id);
    List<String> getAllCategories();
    List<MetricRow> getInventoryMetrics();
}
