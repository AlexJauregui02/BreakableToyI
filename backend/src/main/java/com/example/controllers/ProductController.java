package com.example.controllers;

import com.example.models.Product;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.service.ProductService;

// This class is a REST controller for managing products
@RestController
public class ProductController {

    private final ProductService productService;
    //private static final int PAGE_SIZE = 10;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }


    // This method handles GET requests to retrieve all products
    @GetMapping("/api/products")
	public List<Product> getAllProducts() {
        System.out.println("Fetching all products");

        return productService.getAllProducts();
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
        // Logic to delete a product
        productService.productOutOfStock(id);

        return ResponseEntity.noContent().build();
    }

    // This method handles PUT requests to mark a product as in stock
    @PutMapping("/api/products/{id}/inStock")
    public ResponseEntity<Void> productInStock(@PathVariable Long id) {
        // Logic to mark a product as in stock
        productService.productInStock(id);
        System.out.println("Marking product as in stock");
        return ResponseEntity.noContent().build();
    }
}
