package com.example.service;

import java.util.List;
import java.util.Map;

import com.example.models.CustomPage;
import com.example.models.Product;

public interface ProductServiceInterface {
    CustomPage<Product> getProducts(String name, List<String> categories, Boolean availability,
                                           String sortBy1, String sortDirection1, String sortBy2, String sortDirection2,
                                           int page, int size);
    Product createProduct(Product product);
    Product updateProduct(Product product);
    void productOutOfStock(Long id);
    void productInStock(Long id);
    void productDelete(Long id);
    List<String> getAllCategories();
    List<Map<String, Object>> getInventoryMetrics();
}
