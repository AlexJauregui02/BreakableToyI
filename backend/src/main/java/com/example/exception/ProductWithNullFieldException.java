package com.example.exception;

public class ProductWithNullFieldException extends IllegalArgumentException{
    public ProductWithNullFieldException(String fieldName) {
        super("Product field cannot be null: " + fieldName);
    }
}
