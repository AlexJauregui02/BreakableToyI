package com.example.service;

import com.example.models.Product;
import com.example.repositories.InMemoryProductRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class ProductService {
    private final InMemoryProductRepository repository;

    public ProductService(InMemoryProductRepository inMemoryRepository) {
        this.repository = inMemoryRepository;
    }

    public List<Product> getAllProducts() {
        return repository.findAll();
    }

    // Add all logic related to products here
    public Product createProduct(Product product) {
        product.setExpirationDate(LocalDate.now());
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
                .orElseThrow(() -> new RuntimeException("Product not found"));
        product.setInStock(0);
        product.setUpdatedAt(LocalDateTime.now());
        repository.save(product);
    }

    public void productInStock(Long id) {
        Product product = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        product.setInStock(product.getInStock() + 10); // Default in-stock quantity
        product.setUpdatedAt(LocalDateTime.now());
        repository.save(product);
    }


}
