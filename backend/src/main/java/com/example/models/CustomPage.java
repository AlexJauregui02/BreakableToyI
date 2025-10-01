package com.example.models;

import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Custom pagination wrapper")
public class CustomPage<T> {

    @Schema(description = "Content of the current page. (eg. list of products)")
    private List<T> content;
    @Schema(description = "Current page number (0-indexed).", example = "0")
    private int pageNumber;
    @Schema(description = "Number of items per page.", example = "10")
    private int pageSize;
    @Schema(description = "Total number of items across all pages.", example = "100")
    private int totalElements;

    // Constructor vacío
    public CustomPage() {}

    // Constructor con argumentos
    public CustomPage(
        List<T> content, 
        int pageNumber, 
        int pageSize, 
        int totalElements
    ){
        this.content = content;
        this.pageNumber = pageNumber;
        this.pageSize = pageSize;
        this.totalElements = totalElements;
    }

    public List<T> getContent(){ return content; }
    public void setContent(List<T> content) { this.content = content; }

    public int getPageNumber() { return pageNumber; }
    public void setPageNumber(int pageNumber) { this.pageNumber = pageNumber; }

    public int getPageSize() { return pageSize; }
    public void setPageSize(int pageSize) { this.pageSize = pageSize; }

    public int getTotalElements() { return totalElements; }
    public void setTotalElements(int totalElements) { this.totalElements = totalElements; }
}
