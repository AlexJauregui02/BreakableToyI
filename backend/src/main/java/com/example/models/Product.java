package com.example.models;

import java.time.LocalDate;
import java.time.LocalDateTime;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Product information")
public class Product {

    @Schema(description = "Unique identifier of the product", example = "1", accessMode = Schema.AccessMode.READ_ONLY)
    private Long id;
    @Schema(description = "Name of the product", example = "Apple")
    private String name;
    @Schema(description = "Category of the product", example = "Fruits")
    private String category;
    @Schema(description = "Unit price of the product", example = "0.99")
    private double unitPrice;
    @Schema(description = "Expiration date of the product", example = "2024-12-31")
    private LocalDate expirationDate;
    @Schema(description = "Number of items in stock", example = "100")
    private Integer inStock;

    @Schema(description = "Timestamp when the product was created", example = "2024-01-01T12:00:00")
    private LocalDateTime createdAt;
    @Schema(description = "Timestamp when the product was last updated", example = "2024-01-02T15:30:00")
    private LocalDateTime updatedAt;

    // Default constructor
    // This constructor initializes an empty producto object
    public Product() {}

    // Constructor with parameters
    // This constructor initializes all fields of the producto class
    public Product(String name, String category, double unitPrice, LocalDate expirationDate, Integer inStock, LocalDateTime createdAt, LocalDateTime updatedAt) {
        super();
        this.name = name;
        this.category = category;
        this.unitPrice = unitPrice;
        this.expirationDate = expirationDate;
        this.inStock = inStock;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    };

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public double getUnitPrice() { return unitPrice; }
    public void setUnitPrice(double unitPrice) { this.unitPrice = unitPrice; }

    public LocalDate getExpirationDate() { return expirationDate; }
    public void setExpirationDate(LocalDate expirationDate) { this.expirationDate = expirationDate; }

    public Integer getInStock() { return inStock; }
    public void setInStock(Integer inStock) { this.inStock = inStock; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
