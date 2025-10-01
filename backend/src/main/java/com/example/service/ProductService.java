package com.example.service;

import com.example.models.Product;
import com.example.models.ProductPage;
import com.example.repositories.InMemoryProductRepository;
import com.example.exception.ProductNotFoundException;
import com.example.models.MetricRow;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

@Service
public class ProductService implements ProductServiceInterface {
    private final InMemoryProductRepository repository;

    public ProductService(InMemoryProductRepository inMemoryRepository) {
        this.repository = inMemoryRepository;
    }

    public ProductPage getProducts(String name, List<String> categories, Boolean availability,
                                           String sortBy1, String sortDirection1, String sortBy2, String sortDirection2,
                                           int page, int size) {
        return repository.getProducts(name, categories, availability, sortBy1, sortDirection1, sortBy2, sortDirection2, page, size);
    }

    public Product createProduct(Product product) {
        product.setCreatedAt(LocalDateTime.now());
        product.setUpdatedAt(LocalDateTime.now());
        return repository.save(product);
    }

    public Product updateProduct(Product product) {
        product.setUpdatedAt(LocalDateTime.now());
        return repository.save(product);
    }

    public void productOutOfStock(Long id) {
        Product product = repository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));
        product.setInStock(0);
        product.setUpdatedAt(LocalDateTime.now());
        repository.save(product);
    }

    public void productInStock(Long id) {
        Product product = repository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));
        product.setInStock(product.getInStock() + 10); // Default in-stock quantity
        product.setUpdatedAt(LocalDateTime.now());
        repository.save(product);
    }

    public void productDelete(Long id) {
        repository.deleteById(id);
    }

    public List<String> getAllCategories() {
        return repository.findAllCategories();
    }

    public List<MetricRow> getInventoryMetrics() {
        List<MetricRow> metricsTable = new ArrayList<>();
        List<Product> allProducts = repository.findAll();
        List<String> allCategories = repository.findAllCategories();

        for (String category : allCategories) {
            List<Product> categoryProducts = allProducts.stream()
                .filter(p -> p.getCategory().equals(category))
                .collect(Collectors.toList());
            int categoryInStock = categoryProducts.stream()
                .mapToInt(Product::getInStock)
                .sum();
            double categoryValue = categoryProducts.stream()
                .filter(p -> p.getInStock() > 0)
                .mapToDouble(p -> p.getUnitPrice() * p.getInStock())
                .sum();

            metricsTable.add(new MetricRow(
                category,
                categoryInStock,
                categoryValue,
                calculateAvgPrice(categoryValue, categoryInStock)
            ));
        }

        int allProductsInStock = allProducts.stream()
                .mapToInt(Product::getInStock)
                .sum();
        double allProductsCategoryValue = allProducts.stream()
                .filter(p -> p.getInStock() > 0)
                .mapToDouble(p -> p.getUnitPrice() * p.getInStock())
                .sum();
        
        metricsTable.add(new MetricRow(
            "Overall", 
            allProductsInStock,
            allProductsCategoryValue, 
            calculateAvgPrice(allProductsCategoryValue, allProductsInStock)
        ));

        return metricsTable;
    }

    private double calculateAvgPrice(double totalPrice, int totalStock) {
       return  totalStock != 0 ? totalPrice / totalStock : 0.0;
    }
}
