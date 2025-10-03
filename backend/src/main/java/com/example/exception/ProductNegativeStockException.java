package com.example.exception;

public class ProductNegativeStockException extends IllegalArgumentException{
    public ProductNegativeStockException(Integer stock) {
        super("In-stock quantity cannot be negative: " + stock);
    }
}
