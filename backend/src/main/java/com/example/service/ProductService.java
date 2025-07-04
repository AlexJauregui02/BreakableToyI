package com.example.service;

import com.example.models.Product;
import com.example.repositories.ProductRepository;
import com.example.models.CustomPage;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

@Service
public class ProductService {
    private final ProductRepository repository;

    public ProductService(ProductRepository repository) {
        this.repository = repository;
    }

    public CustomPage getProducts(String name, List<String> categories, Boolean availability,
                                           String sortBy1, String sortDirection1, String sortBy2, String sortDirection2,
                                           int page, int size) {
        List<Product> filtered = applyFilters(repository.findAll(), name, categories, availability);
        filtered.sort(createComparator(sortBy1, sortDirection1, sortBy2, sortDirection2));
        List<Product> paginated = applyPagination(filtered, page, size);
        return new CustomPage(paginated, page, size, filtered.size());
    }

    private List<Product> applyFilters(List<Product> products, String nameFilter, List<String> categoryFilters, Boolean availabilityFilter) {
        return products.stream()
            .filter(p -> nameFilter == null || p.getName().toLowerCase().contains(nameFilter.toLowerCase()))
            .filter(p -> categoryFilters == null || categoryFilters.isEmpty() || categoryFilters.contains(p.getCategory()))
            .filter(p -> availabilityFilter == null || (availabilityFilter && p.getInStock() > 0) || (!availabilityFilter && p.getInStock() == 0))
            .collect(Collectors.toList());
    }

    private Comparator<Product> createComparator(String sortBy1, String sortDirection1, String sortBy2, String sortDirection2) {
        Comparator<Product> comp = getProductComparator(sortBy1, sortDirection1);
        if(sortBy2 != null && !sortBy2.isEmpty()) {
            comp = comp.thenComparing(getProductComparator(sortBy2, sortDirection2));
        }
        return comp;
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
                case "unitPrice":
                    comparator = Comparator.comparing(Product::getUnitPrice);
                    break;
                case "inStock":
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

    private List<Product> applyPagination(List<Product> products, int page, int size) {
        int total = products.size();
        int start = page * size;
        if (start > total) {
            return Collections.emptyList();
        }
        int end = Math.min(start + size, total);
        return products.subList(start, end);
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

    public void productDelete(Long id) {
        repository.deleteById(id);
    }

    public List<String> getAllCategories() {
        return repository.findAllCategories();
    }

    public List<Map<String, Object>> getInventoryMetrics() {
        List<Map<String, Object>> metricsTable = new ArrayList<>();
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

            metricsTable.add(createMetricsRow(
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
        
        metricsTable.add(createMetricsRow(
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

    private Map<String, Object> createMetricsRow(String category, int count, Double totalValue, Double avgPrice) {
        Map<String, Object> row = new LinkedHashMap<>();
        row.put("category", category);
        row.put("productCount", count);
        row.put("totalValue", totalValue);
        row.put("averagePrice", avgPrice);

        return row;
    }
}
