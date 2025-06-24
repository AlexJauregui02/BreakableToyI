package com.example.backend;

import com.example.models.Product;
import com.example.models.CustomPage;
import com.example.repositories.InMemoryProductRepository;
import com.example.service.ProductService;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class BackendApplicationTests {

	@Mock
	private InMemoryProductRepository repository;

	@InjectMocks
	private ProductService productService;

	@Test
	void testGetProducts() {
		Product p1 = new Product();
		p1.setId(1L);
		p1.setName("Product1");
		p1.setCategory("Category1");
		p1.setUnitPrice(10.0);
		p1.setInStock(5);

		Product p2 = new Product();
		p2.setId(2L);
		p2.setName("Product2");
		p2.setCategory("Category2");
		p2.setUnitPrice(20.0);
		p2.setInStock(3);

		List<Product> products = java.util.Arrays.asList(p1, p2);
		CustomPage<Product> page = new CustomPage<>(products, 0, 10, 2);

		Mockito.when(repository.getProducts(
			"",
			java.util.Collections.emptyList(),
			null,
			"",
			"",
			"", 
			"", 
			0, 
			10 
		)).thenReturn(page);

		CustomPage<Product> result = productService.getProducts(
			"", java.util.Collections.emptyList(), null, "", "", "", "", 0, 10
		);

		assertNotNull(result);
		assertEquals(2, result.getContent().size());
		assertEquals("Product1", result.getContent().get(0).getName());
		assertEquals("Product2", result.getContent().get(1).getName());
		assertEquals(0, result.getPageNumber());
		assertEquals(10, result.getPageSize());
		assertEquals(2, result.getTotalElements());
	}

	@Test
	void testCreateProduct() {
		Product product = new Product();
        product.setName("Test Product");
        product.setCategory("Test Category");
        product.setUnitPrice(10.0);
        product.setExpirationDate(LocalDate.of(2025, 10, 10));
        product.setInStock(5);

        Product savedProduct = new Product();
        savedProduct.setId(1L);
        savedProduct.setName("Test Product");
        savedProduct.setCategory("Test Category");
        savedProduct.setUnitPrice(10.0);
        savedProduct.setExpirationDate(LocalDate.of(2025, 10, 10));
        savedProduct.setInStock(5);
        savedProduct.setCreatedAt(LocalDateTime.now());
        savedProduct.setUpdatedAt(LocalDateTime.now());

        Mockito.when(repository.save(any(Product.class))).thenReturn(savedProduct);

        Product result = productService.createProduct(product);

        assertNotNull(result);
        assertEquals("Test Product", result.getName());
        assertEquals("Test Category", result.getCategory());
        assertEquals(10.0, result.getUnitPrice());
        assertEquals(LocalDate.of(2025, 10, 10), result.getExpirationDate());
        assertEquals(5, result.getInStock());
	}

	@Test
	void testUpdateProduct() {
		Product product = new Product();
		product.setId(1L);
		product.setName("Updated Product");
		product.setCategory("Updated Category");
		product.setUnitPrice(20.0);
		product.setExpirationDate(LocalDate.of(2026, 5, 5));
		product.setInStock(10);

		Product updatedProduct = new Product();
		updatedProduct.setId(1L);
		updatedProduct.setName("Updated Product");
		updatedProduct.setCategory("Updated Category");
		updatedProduct.setUnitPrice(20.0);
		updatedProduct.setExpirationDate(LocalDate.of(2026, 5, 5));
		updatedProduct.setInStock(10);
		updatedProduct.setCreatedAt(LocalDateTime.now());
		updatedProduct.setUpdatedAt(LocalDateTime.now());

		Mockito.when(repository.save(any(Product.class))).thenReturn(updatedProduct);

		Product result = productService.updateProduct(product);

		assertNotNull(result);
		assertEquals("Updated Product", result.getName());
		assertEquals("Updated Category", result.getCategory());
		assertEquals(20.0, result.getUnitPrice());
		assertEquals(LocalDate.of(2026, 5, 5), result.getExpirationDate());
		assertEquals(10, result.getInStock());
	}

	@Test
	void testProductOutOfStock() {
		Product product = new Product();
		product.setId(2L);
		product.setInStock(30);

		Mockito.when(repository.findById(2L)).thenReturn(java.util.Optional.of(product));
		Mockito.when(repository.save(any(Product.class))).thenReturn(product);

		productService.productOutOfStock(2L);

		assertEquals(0, product.getInStock());
	}

	@Test
	void testProductInStock() {
		Product product = new Product();
		product.setId(3L);
		product.setInStock(0);

		Mockito.when(repository.findById(3L)).thenReturn(java.util.Optional.of(product));
		Mockito.when(repository.save(any(Product.class))).thenReturn(product);

		productService.productInStock(3L);

		assertEquals(10, product.getInStock());
	}

	@Test
	void testProductDelete() {
		productService.productDelete(4L);
		Mockito.verify(repository).deleteById(4L);
	}

	@Test
	void testGetAllCategories() {
		List<String> categories = java.util.Arrays.asList("Category1", "Category2");
		Mockito.when(repository.findAllCategories()).thenReturn(categories);

		List<String> result = productService.getAllCategories();

		assertEquals(2, result.size());
		assertEquals("Category1", result.get(0));
		assertEquals("Category2", result.get(1));
	}

	@Test
	void testGetInventoryMetrics() {

		Product p1 = new Product();
		p1.setId(1L);
		p1.setName("A");
		p1.setCategory("Category1");
		p1.setUnitPrice(10.0);
		p1.setInStock(2);

		Product p2 = new Product();
		p2.setId(2L);
		p2.setName("B");
		p2.setCategory("Category2");
		p2.setUnitPrice(20.0);
		p2.setInStock(3);

		Product p3 = new Product();
		p3.setId(3L);
		p3.setName("C");
		p3.setCategory("Category1");
		p3.setUnitPrice(15.0);
		p3.setInStock(0);

		List<Product> allProducts = java.util.Arrays.asList(p1, p2, p3);
		List<String> allCategories = java.util.Arrays.asList("Category1", "Category2");

		Mockito.when(repository.findAll()).thenReturn(allProducts);
		Mockito.when(repository.findAllCategories()).thenReturn(allCategories);

		List<java.util.Map<String, Object>> metrics = productService.getInventoryMetrics();


		assertNotNull(metrics);
		assertEquals(3, metrics.size());

		java.util.Map<String, Object> cat1Row = metrics.stream()
			.filter(row -> "Category1".equals(row.get("category")))
			.findFirst()
			.orElse(null);

		assertNotNull(cat1Row);
		assertEquals(2, cat1Row.get("productCount"));
		assertEquals(20.0, (Double)cat1Row.get("totalValue"));
		assertEquals(10.0, (Double)cat1Row.get("averagePrice"));
	}

}
