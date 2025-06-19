package com.example.repositories;

import com.example.models.Product;
import com.example.models.CustomPage;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Repository;

import java.util.ArrayList;

@Repository
public class InMemoryProductRepository implements ProductRepository {
    private final Map<Long, Product> db = new HashMap<>();
    private long idCounter = 1;

    @Override
    public Product save(Product product) {
       if (product.getId() == null || product.getId() <= 0) {
            product.setId(idCounter++);
            db.put(product.getId(), product);

            return product;
        } else {
            Product existingProduct = db.get(product.getId());
            if (existingProduct == null) {
                throw new RuntimeException("Product not found with ID: " + product.getId());
            }
            existingProduct.setName(product.getName());
            existingProduct.setCategory(product.getCategory());
            existingProduct.setUnitPrice(product.getUnitPrice());
            existingProduct.setExpirationDate(product.getExpirationDate());
            existingProduct.setInStock(product.getInStock());
            existingProduct.setUpdatedAt(product.getUpdatedAt());

            db.replace(existingProduct.getId(), existingProduct);

            return existingProduct;
        }
    }

    @Override
    public List<Product> findAll() {
        return new ArrayList<>(db.values());
    }

    @Override
    public CustomPage<Product> getProducts(String nameFilter, int page, int size) {
        List<Product> filtereProducts = db.values().stream()
            .filter(p -> nameFilter == null || p.getName().toLowerCase().contains(nameFilter.toLowerCase()))
            .collect(Collectors.toList());

        int totalItems = filtereProducts.size();
        int start = page * size;
        int end = Math.min(start + size, totalItems);

        List<Product> paginateProducts = filtereProducts.subList(start, end);

        return new CustomPage<>(paginateProducts, page, size, totalItems);
    }

    @Override
    public List<String> findAllCategories() {
        return db.values().stream()
            .map(Product::getCategory)
            .distinct()
            .collect(Collectors.toList());
    }

    @Override
    public long countAllProducts() {
        return db.size();
    }

    @Override
    public Optional<Product> findById(Long id) {
        return Optional.ofNullable(db.get(id));
    }

    @Override
    public void deleteById(Long id) {
        db.remove(id);
    }
    
}
