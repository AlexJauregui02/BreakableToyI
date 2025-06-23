package com.example.repositories;

import com.example.models.Product;
import com.example.models.CustomPage;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;

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
    public CustomPage<Product> getProducts(String nameFilter, List<String> categoryFilters, Boolean availabilityFilter,
                                           String sortBy1, String sortDirection1, String sortBy2, String sortDirection2, 
                                           int page, int size) {
        List<Product> filteredProducts = db.values().stream()
            .filter(p -> nameFilter == null || p.getName().toLowerCase().contains(nameFilter.toLowerCase()))
            .filter(p -> categoryFilters == null || categoryFilters.isEmpty() || categoryFilters.contains(p.getCategory()))
            .filter(p -> availabilityFilter == null || (availabilityFilter && p.getInStock() > 0) || (!availabilityFilter && p.getInStock() == 0))
            .collect(Collectors.toList());

        Comparator<Product> comparator = getProductComparator(sortBy1, sortDirection1);
        if(sortBy2 != null && !sortBy2.isEmpty()) {
            comparator = comparator.thenComparing(getProductComparator(sortBy2, sortDirection2));
        }

        filteredProducts.sort(comparator);

        int totalItems = filteredProducts.size();
        int start = page * size;
        int end = Math.min(start + size, totalItems);

        List<Product> paginateProducts = filteredProducts.subList(start, end);

        return new CustomPage<>(paginateProducts, page, size, totalItems);
    }

    private Comparator<Product> getProductComparator(String sortBy, String sortDirection) {
        Comparator<Product> comparator;
        if (sortBy == null) {
            comparator = Comparator.comparing(Product::getId);
        } else {
            switch(sortBy) {
                case "name":
                    comparator = Comparator.comparing(Product::getName);
                    break;
                case "category":
                    comparator = Comparator.comparing(Product::getCategory);
                    break;
                case "price":
                    comparator = Comparator.comparing(Product::getUnitPrice);
                    break;
                case "stock":
                    comparator = Comparator.comparing(Product::getInStock);
                    break;
                case "expirationDate":
                    comparator = Comparator.comparing(p -> p.getExpirationDate() == null ? LocalDate.MAX : p.getExpirationDate());
                    break;
                default:
                    comparator = Comparator.comparing(Product::getId);
                    break;
            }
        }
        return sortDirection.equalsIgnoreCase("desc") ? comparator.reversed() : comparator;
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
