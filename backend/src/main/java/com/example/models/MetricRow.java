package com.example.models;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Metric row details")
public class MetricRow {
    
    @Schema(description = "Product category", example = "Electronics")
    private String category;
    @Schema(description = "Number of products in this category", example = "50")
    private int productCount;
    @Schema(description = "Total value of products in this category", example = "15000.75")
    private double totalValue;
    @Schema(description = "Average price of products in this category", example = "300.15")
    private double averagePrice;

    public MetricRow() {}

    public MetricRow(String category, int productCount, double totalValue, double averagePrice) {
        this.category = category;
        this.productCount = productCount;
        this.totalValue = totalValue;
        this.averagePrice = averagePrice;
    }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public int getProductCount() { return productCount; }
    public void setProductCount(int productCount) { this.productCount = productCount; }

    public double getTotalValue() { return totalValue; }
    public void setTotalValue(double totalValue) { this.totalValue = totalValue; }

    public double getAveragePrice() { return averagePrice; }
    public void setAveragePrice(double averagePrice) { this.averagePrice = averagePrice; }
}