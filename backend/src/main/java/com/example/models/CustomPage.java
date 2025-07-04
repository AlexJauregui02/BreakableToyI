package com.example.models;

import java.util.List;

public class CustomPage {
    private List<Product> content;
    private int pageNumber;
    private int pageSize;
    private int totalElements;

    public CustomPage(
        List<Product> content, 
        int pageNumber, 
        int pageSize, 
        int totalElements
    ){
        this.content = content;
        this.pageNumber = pageNumber;
        this.pageSize = pageSize;
        this.totalElements = totalElements;
    }

    public List<Product> getContent(){ return content; }
    public int getPageNumber() { return pageNumber; }
    public int getPageSize() { return pageSize; }
    public int getTotalElements() { return totalElements; } 
}
