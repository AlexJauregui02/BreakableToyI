package com.example.repositories;

import com.example.models.Product;
import com.example.models.CustomPage;

import java.util.List;
import java.util.Optional;

public interface ProductRepository {
    Product save(Product product);
    List<Product> findAll();
    Optional<Product> findById(Long id);
    CustomPage<Product> getProducts(String nameFilter, List<String> categoryFilters, Boolean availabilityFilter,
                                           String sortBy1, String sortDirection1, String sortBy2, String sortDirection2, 
                                           int page, int size);
    List<String> findAllCategories();
    long countAllProducts();
    void deleteById(Long id);
}
