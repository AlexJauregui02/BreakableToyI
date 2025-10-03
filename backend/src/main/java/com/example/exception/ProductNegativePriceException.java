package com.example.exception;

public class ProductNegativePriceException extends IllegalArgumentException{
    public ProductNegativePriceException(Double price) {
        super("Product price cannot be negative: " + price);
    }
}
