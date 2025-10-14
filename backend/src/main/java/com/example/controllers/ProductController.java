package com.example.controllers;

import com.example.models.Product;
import com.example.models.ProductPage;
import com.example.exception.ProductNegativePriceException;
import com.example.exception.ProductNegativeStockException;
import com.example.exception.ProductNotFoundException;
import com.example.exception.ProductWithNullFieldException;
import com.example.models.ErrorResponse;
import com.example.models.MetricRow;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.service.ProductServiceInterface;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;

@RestController
public class ProductController {

    private final ProductServiceInterface productService;

    public ProductController(ProductServiceInterface productService) {
        this.productService = productService;
    }

    @Operation(summary = "Get products with filters and sorting")
    @GetMapping("/api/products")
	public ResponseEntity<ProductPage> getProducts(
        @RequestParam(required = false) String name,
        @RequestParam(required = false) List<String> category,
        @RequestParam(required = false) String availability,
        @RequestParam(required = false) String sortBy1,
        @RequestParam(required = false) String sortDirection1,
        @RequestParam(required = false) String sortBy2,
        @RequestParam(required = false) String sortDirection2,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ) {
        Boolean availabilityFilter = null;
        if (availability != null && !availability.isEmpty()) {
            if (availability.equalsIgnoreCase("in_stock")) {
                availabilityFilter = true;
            } else if (availability.equalsIgnoreCase("out_of_stock")) {
                availabilityFilter = false;
            }
        }

        ProductPage products = productService.getProducts(
            name,
            category,
            availabilityFilter,
            sortBy1,
            Optional.ofNullable(sortDirection1).orElse("asc"),
            sortBy2,
            Optional.ofNullable(sortDirection2).orElse("asc"),
            page, 
            size); 

        return ResponseEntity.ok(products);
    }

    @Operation(summary = "Get all the general metrics")
    @GetMapping("/api/products/metrics")
	public ResponseEntity<List<MetricRow>> getMetrics() {
        List<MetricRow> metrics = productService.getInventoryMetrics(); 

        return ResponseEntity.ok(metrics);
    }

    @Operation(summary = "Get all the available categories")
    @GetMapping("/api/products/categories")
	public ResponseEntity<List<String>> getCategories() {
        List<String> categories = productService.getAllCategories(); 

        return ResponseEntity.ok(categories);
    }

    @Operation(summary = "Create a new product")
    @PostMapping("/api/products")
    public ResponseEntity<Product> createProduct(@Valid @RequestBody Product product) {
        Product newProduct = productService.createProduct(product);

        return ResponseEntity.ok(newProduct);
    }

    @Operation(summary = "Update an existing product")
    @PutMapping("/api/products/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @Valid @RequestBody Product product) {
        product.setId(id);
        Product updatedProduct = productService.updateProduct(product);

        return ResponseEntity.ok(updatedProduct);
    }

    @Operation(summary = "Updates the product's stock to 0")
    @PostMapping("/api/products/{id}/outofstock")
    public ResponseEntity<Void> productOutOfStock(@PathVariable Long id) {
        productService.productOutOfStock(id);

        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Adds 10 to the product's stock")
    @PutMapping("/api/products/{id}/inStock")
    public ResponseEntity<Void> productInStock(@PathVariable Long id) {
        productService.productInStock(id);
        System.out.println("Marking product as in stock");
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Method that deletes a product")
    @DeleteMapping("api/products/{id}")
    public ResponseEntity<Void> productDelete(@PathVariable Long id) {
        productService.productDelete(id);
        return ResponseEntity.noContent().build();
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneral(Exception ex) {
        ErrorResponse error = new ErrorResponse("Unexpected error: " + ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR.value());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }

    @ExceptionHandler(ProductNegativePriceException.class)
    public ResponseEntity<ErrorResponse> handleNegativePrice(ProductNegativePriceException ex) {
        ErrorResponse error = new ErrorResponse(ex.getMessage(), HttpStatus.BAD_REQUEST.value());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(ProductNegativeStockException.class)
    public ResponseEntity<ErrorResponse> handleNegativeStock(ProductNegativeStockException ex) {
        ErrorResponse error = new ErrorResponse(ex.getMessage(), HttpStatus.BAD_REQUEST.value());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(ProductWithNullFieldException.class)
    public ResponseEntity<ErrorResponse> handleNullField(ProductWithNullFieldException ex) {
        ErrorResponse error = new ErrorResponse(ex.getMessage(), HttpStatus.BAD_REQUEST.value());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(ProductNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(ProductNotFoundException ex) {
        ErrorResponse error = new ErrorResponse(ex.getMessage(), HttpStatus.NOT_FOUND.value());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(MethodArgumentNotValidException ex) {
        String errorMsg = ex.getBindingResult().getFieldErrors().stream()
            .map(e -> e.getField() + ": " + e.getDefaultMessage())
            .reduce((m1, m2) -> m1 + "; " + m2)
            .orElse("Validation error");
        ErrorResponse error = new ErrorResponse(errorMsg, HttpStatus.BAD_REQUEST.value());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }
}
