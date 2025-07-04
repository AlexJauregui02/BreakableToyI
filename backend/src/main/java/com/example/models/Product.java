package com.example.models;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "products")
public class Product {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String category;

    @Column(name = "unit_price")
    private double unitPrice;

    @Column(name = "expiration_date")
    private LocalDate expirationDate;

    @Column(name = "in_stock")
    private Integer inStock;
    private LocalDateTime createdAt;
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

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getCategory() {
        return category;
    }
    public void setCategory(String category) {
        this.category = category;
    }
    public double getUnitPrice() {
        return unitPrice;
    }
    public void setUnitPrice(double unitPrice) {
        this.unitPrice = unitPrice;
    }
    public LocalDate getExpirationDate() {
        return expirationDate;
    }
    public void setExpirationDate(LocalDate expirationDate) {
        this.expirationDate = expirationDate;
    }
    public Integer getInStock() {
        return inStock;
    }
    public void setInStock(Integer inStock) {
        this.inStock = inStock;
    }
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
