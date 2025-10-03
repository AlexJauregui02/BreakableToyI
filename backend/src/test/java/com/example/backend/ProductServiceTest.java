package com.example.backend;

import com.example.models.Product;
import com.example.models.ProductPage;
import com.example.exception.ProductNegativePriceException;
import com.example.exception.ProductNegativeStockException;
import com.example.exception.ProductNotFoundException;
import com.example.exception.ProductWithNullFieldException;
import com.example.models.CustomPage;
import com.example.models.MetricRow;
import com.example.repositories.InMemoryProductRepository;
import com.example.service.ProductService;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

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
class ProductServiceTest {

	@Mock
	private InMemoryProductRepository repository;

	@InjectMocks
	private ProductService productService;

	private Product createSampleProduct(Long id, String name, String category, double price, int stock) {
		Product product = new Product();
		product.setId(id);
		product.setName(name);
		product.setCategory(category);
		product.setUnitPrice(price);
		product.setExpirationDate(LocalDate.of(2025, 10, 10));
		product.setInStock(stock);
		product.setCreatedAt(LocalDateTime.now());
		product.setUpdatedAt(LocalDateTime.now());
		return product;
	}

	@Test
	void testGetProducts() {
		Product p1 = createSampleProduct(1L, "Product1", "Category1", 10.0, 5);
		Product p2 = createSampleProduct(2L, "Product2", "Category2", 20.0, 3);

		List<Product> products = java.util.Arrays.asList(p1, p2);
		ProductPage page = new ProductPage(products, 0, 10, 2);

		Mockito.when(repository.getProducts(
				"",
				java.util.Collections.emptyList(),
				null,
				"",
				"",
				"",
				"",
				0,
				10)).thenReturn(page);

		CustomPage<Product> result = productService.getProducts(
				"", java.util.Collections.emptyList(), null, "", "", "", "", 0, 10);

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
		Product product = createSampleProduct(1L, "Test Product", "Test Category", 10.0, 5);
		Product savedProduct = createSampleProduct(1L, "Test Product", "Test Category", 10.0, 5);

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
	void testCreateProductWithNegativePriceUnit() {
		Product product = createSampleProduct(1L, "Invalid Product", "Test Category", -5.0, 5);

		assertThrows(ProductNegativePriceException.class, () -> productService.createProduct(product));
		verify(repository, never()).save(any(Product.class));
	}

	@Test
	void testCreateProductWithNullFields() {
		Product product = new Product();
		// No fields set

		assertThrows(ProductWithNullFieldException.class, () -> productService.createProduct(product));
	}

	@Test
	void testUpdateProduct() {
		Product product = createSampleProduct(1L, "Product", "Category", 20.0, 10);
		Product updatedProduct = createSampleProduct(1L, "Updated Product", "Updated Category", 20.0, 10);

		Mockito.when(repository.save(any(Product.class))).thenReturn(updatedProduct);
		Product result = productService.updateProduct(product);

		assertNotNull(result);
		assertEquals("Updated Product", result.getName());
		assertEquals("Updated Category", result.getCategory());
		assertEquals(20.0, result.getUnitPrice());
		assertEquals(LocalDate.of(2025, 10, 10), result.getExpirationDate());
		assertEquals(10, result.getInStock());
	}

	@Test
	void testUpdateProductWithNegativeStock() {
		Product product = createSampleProduct(1L, "Product", "Category", 10.0, -10);

		assertThrows(ProductNegativeStockException.class, () -> productService.updateProduct(product));
	}

	@Test
	void testProductOutOfStock() {
		Product product = createSampleProduct(2L, "Product", "Category", 15.0, 30);

		Mockito.when(repository.findById(2L)).thenReturn(java.util.Optional.of(product));
		Mockito.when(repository.save(any(Product.class))).thenReturn(product);

		productService.productOutOfStock(2L);

		assertEquals(0, product.getInStock());
	}

	@Test
	void testProductInStock() {
		Product product = createSampleProduct(4L, "Product", "Category", 15.0, 0);

		Mockito.when(repository.findById(4L)).thenReturn(java.util.Optional.of(product));
		Mockito.when(repository.save(any(Product.class))).thenReturn(product);

		productService.productInStock(4L);

		assertEquals(10, product.getInStock());
	}

	@Test
	void testProductDelete() {
		Product product = createSampleProduct(4L, "Product", "Category", 15.0, 0);

		Mockito.when(repository.findById(4L)).thenReturn(java.util.Optional.of(product));

		productService.productDelete(4L);

		Mockito.verify(repository).deleteById(4L);
	}

	@Test
	void testDeleteNonExistentProduct() {
		Mockito.when(repository.findById(99L)).thenReturn(java.util.Optional.empty());

		assertThrows(ProductNotFoundException.class,
				() -> productService.productDelete(99L));
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
		Product p1 = createSampleProduct(1L, "A", "Category1", 10.0, 2);
		Product p2 = createSampleProduct(2L, "B", "Category2", 20.0, 3);
		Product p3 = createSampleProduct(3L, "C", "Category1", 15.0, 0);

		List<Product> allProducts = java.util.Arrays.asList(p1, p2, p3);
		List<String> allCategories = java.util.Arrays.asList("Category1", "Category2");

		Mockito.when(repository.findAll()).thenReturn(allProducts);
		Mockito.when(repository.findAllCategories()).thenReturn(allCategories);

		List<MetricRow> metrics = productService.getInventoryMetrics();

		assertNotNull(metrics);
		assertEquals(3, metrics.size());

		MetricRow cat1Row = metrics.stream()
				.filter(row -> "Category1".equals(row.getCategory()))
				.findFirst()
				.orElse(null);

		assertNotNull(cat1Row);
		assertEquals(2, cat1Row.getProductCount());
		assertEquals(20.0, cat1Row.getTotalValue());
		assertEquals(10.0, cat1Row.getAveragePrice());
	}

	@Test
	void testProductNotFoundException() {
		Mockito.when(repository.findById(99L)).thenReturn(java.util.Optional.empty());
		assertThrows(ProductNotFoundException.class, () -> productService.productOutOfStock(99L));
	}

}
