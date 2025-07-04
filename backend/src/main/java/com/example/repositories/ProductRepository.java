package com.example.repositories;
import com.example.models.Product;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    @Query("SELECT DISTINCT p.category FROM Product p")
    List<String> findAllCategories();

    @Query("SELECT COUNT(p) FROM Product p")
    long countAllProducts();

}
