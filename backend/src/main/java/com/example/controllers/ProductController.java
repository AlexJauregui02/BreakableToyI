package com.example.controllers;

import com.example.models.Product;
import com.example.models.CustomPage;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.service.ProductService;

@RestController
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // This method handles GET requests to retrieve all products
    @GetMapping("/api/products")
	public ResponseEntity<CustomPage<Product>> getProducts(
        @RequestParam(required = false) String name,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ) {
        System.out.println("Fetching products");

        CustomPage<Product> products = productService.getProducts(name, page, size); 

        return ResponseEntity.ok(products);
    }

    // This method handles GET request to retrieve the general metrics
    @GetMapping("/api/products/metrics")
	public ResponseEntity<List<Map<String, Object>>> getMetrics() {
        System.out.println("Fetching metrics");

        List<Map<String, Object>> metrics = productService.getInventoryMetrics(); 

        return ResponseEntity.ok(metrics);
    }

    // This method handles POST requests to retrieve a new product
    @PostMapping("/api/products")
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        System.out.println("Creating new product: " + product.getName());
        Product newProduct = productService.createProduct(product);

        return ResponseEntity.ok(newProduct);
    }

    // This method handles PUT requests to update an existing product
    @PutMapping("/api/products/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product product) {
        product.setId(id);
        Product updatedProduct = productService.updateProduct(product);
        System.out.println("Updating product: " + product.getId());

        return ResponseEntity.ok(updatedProduct);
    }

    // This method handles POST requests to mark a product as out of stock
    @PostMapping("/api/products/{id}/outofstock")
    public ResponseEntity<Void> productOutOfStock(@PathVariable Long id) {
        productService.productOutOfStock(id);

        return ResponseEntity.noContent().build();
    }

    // This method handles PUT requests to mark a product as in stock
    @PutMapping("/api/products/{id}/inStock")
    public ResponseEntity<Void> productInStock(@PathVariable Long id) {
        productService.productInStock(id);
        System.out.println("Marking product as in stock");
        return ResponseEntity.noContent().build();
    }

    // This Method handles DELETE requests to delete an specific product
    @DeleteMapping("api/products/{id}")
    public ResponseEntity<Void> productDelete(@PathVariable Long id) {
        productService.productDelete(id);
        return ResponseEntity.noContent().build();
    }
}
