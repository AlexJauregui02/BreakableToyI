package com.example.backend;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.example.exception.ProductNegativePriceException;
import com.example.exception.ProductNegativeStockException;
import com.example.exception.ProductNotFoundException;
import com.example.exception.ProductWithNullFieldException;
import com.example.models.Product;
import com.example.repositories.InMemoryProductRepository;
import com.example.service.ProductService;

public class ProductServiceIntegrationTest {
    private InMemoryProductRepository repository;
    private ProductService productService;

    private Product createSampleProduct(Long id, String name, String category, double price, int stock) {
		Product product = new Product();
		product.setId(id);
		product.setName(name);
		product.setCategory(category);
		product.setUnitPrice(price);
		product.setExpirationDate(LocalDate.of(2025, 10, 10));
		product.setInStock(stock);
		product.setCreatedAt(LocalDateTime.now());
		product.setUpdatedAt(LocalDateTime.now());
		return product;
	}

    @BeforeEach
    void setUp() {
        repository = new InMemoryProductRepository();
        productService = new ProductService(repository);
    }

    @Test
    void testGetProducts() {
        Product p1 = createSampleProduct(null, "Product1", "Category1", 10.0, 5);
        Product p2 = createSampleProduct(null, "Product2", "Category2", 20.0, 3);

        productService.createProduct(p1);
        productService.createProduct(p2);

        var page = productService.getProducts("", null, null, "name", "asc", null, null, 0, 10);
        assertEquals(2, page.getTotalElements());
    }

    @Test
    void testCreateAndDeleteProduct() {
        Product product = createSampleProduct(null, "Integration Product", "Integration Category", 15.0, 5);

        Product saved = productService.createProduct(product);
        assertNotNull(saved.getId());

        productService.productDelete(saved.getId());
        assertThrows(ProductNotFoundException.class, () -> productService.productDelete(saved.getId()));
    }

    @Test
    void testCreateProductWithInvalidData() {
        Product product = createSampleProduct(null, null, "Invalid Category", 10.0, 5);

        assertThrows(ProductWithNullFieldException.class, () -> productService.createProduct(product));

        product.setName("Valid Name");
        product.setCategory(null); // Null category

        assertThrows(ProductWithNullFieldException.class, () -> productService.createProduct(product));

        product.setCategory("Valid Category");
        product.setInStock(-5); // Negative stock

        assertThrows(ProductNegativeStockException.class, () -> productService.createProduct(product));

        product.setInStock(5);
        product.setUnitPrice(-5); // Negative price

        assertThrows(ProductNegativePriceException.class, () -> productService.createProduct(product));
    }

    @Test
    void testProductInStockAndOutOfStock() {
        Product product = createSampleProduct(null, "Stock Test", "Stock Category", 20.0, 0);

        Product saved = productService.createProduct(product);

        productService.productInStock(saved.getId());
        assertEquals(10, repository.findById(saved.getId()).get().getInStock());

        productService.productOutOfStock(saved.getId());
        assertEquals(0, repository.findById(saved.getId()).get().getInStock());
    }

    @Test
    void testUpdateProduct() {
        Product product = createSampleProduct(null, "Original Product", "Original Category", 15.0, 5);

        Product saved = productService.createProduct(product);

        saved.setName("Updated Product");
        saved.setCategory("Updated Category");
        saved.setUnitPrice(20.0);
        saved.setExpirationDate(java.time.LocalDate.of(2026, 5, 5));
        saved.setInStock(10);

        Product result = productService.updateProduct(saved);

        assertNotNull(result);
        assertEquals("Updated Product", result.getName());
        assertEquals("Updated Category", result.getCategory());
        assertEquals(20.0, result.getUnitPrice());
        assertEquals(java.time.LocalDate.of(2026, 5, 5), result.getExpirationDate());
        assertEquals(10, result.getInStock());
    }

    @Test
    void testUpdateProductWithInvalidData() {
        Product product = createSampleProduct(null, null, "Valid Category", 10.0, 5);

        assertThrows(ProductWithNullFieldException.class, () -> productService.createProduct(product));

        product.setName("Valid Name");
        product.setCategory(null); // Null category

        assertThrows(ProductWithNullFieldException.class, () -> productService.createProduct(product));

        product.setCategory("Valid Category");
        product.setInStock(-5); // Negative stock

        assertThrows(ProductNegativeStockException.class, () -> productService.createProduct(product));

        product.setInStock(5);
        product.setUnitPrice(-5); // Negative price

        assertThrows(ProductNegativePriceException.class, () -> productService.createProduct(product));
    }

}
