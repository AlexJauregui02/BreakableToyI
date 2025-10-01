package com.example.models;

import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Paginated list of products")
public class ProductPage extends CustomPage<Product> {

    public ProductPage() {
        super();
    }

    public ProductPage(List<Product> content, int pageNumber, int pageSize, int totalElements) {
        super(content, pageNumber, pageSize, totalElements);
    }
}
