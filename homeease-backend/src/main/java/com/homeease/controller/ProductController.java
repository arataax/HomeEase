package com.homeease.controller;

import com.homeease.dto.CategoryUpdateRequest;
import com.homeease.model.Category;
import com.homeease.model.Product;
import com.homeease.repository.CategoryRepository;
import com.homeease.repository.ProductRepository;
import com.homeease.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:3000") // Ajusta el origen según sea necesario
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private CategoryRepository categoryRepository;

    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts(); // Asegúrate de que esto devuelva todos los productos
    }

    @PostMapping(value = "/add", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> addProduct(
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("price") Double price,
            @RequestParam("stock") Integer stock,
            @RequestParam(value = "categoryId", required = false) Long categoryId,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        try {
            Product product = new Product();
            product.setName(name);
            product.setDescription(description);
            product.setPrice(price);
            product.setStock(stock);

            if (categoryId != null) {
                Category category = categoryRepository.findById(categoryId)
                        .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
                product.setCategory(category);
            }

            if (image != null && !image.isEmpty()) {
                String imageUrl = "/uploads/" + image.getOriginalFilename();
                Files.copy(image.getInputStream(), Paths.get("uploads", image.getOriginalFilename()), StandardCopyOption.REPLACE_EXISTING);
                product.setImageUrl(imageUrl);
            }

            productService.saveProduct(product);
            return ResponseEntity.ok("Producto guardado correctamente");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al guardar la imagen: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error al guardar el producto: " + e.getMessage());
        }
    }

    @GetMapping("/random")
    public ResponseEntity<List<Product>> getRandomProducts() {
        List<Product> allProducts = productService.getAllProducts(); // Obtén todos los productos
        Collections.shuffle(allProducts); // Mezcla los productos para obtener aleatoriedad
        List<Product> randomProducts = allProducts.stream()
                .limit(10) // Máximo 10 productos
                .collect(Collectors.toList());
        return ResponseEntity.ok(randomProducts);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable Long id) {
        Optional<Product> product = productService.getProductById(id);
        if (product.isPresent()) {
            return ResponseEntity.ok(product.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Producto no encontrado");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        boolean deleted = productService.deleteProduct(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{productId}/category")
    public ResponseEntity<?> assignCategoryToProduct(
            @PathVariable Long productId,
            @RequestBody CategoryUpdateRequest request) {
        Optional<Product> productOptional = productService.getProductById(productId);
        if (!productOptional.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Producto no encontrado");
        }

        Optional<Category> categoryOptional = categoryRepository.findById(request.getCategoryId());
        if (!categoryOptional.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Categoría no encontrada");
        }

        Product product = productOptional.get();
        product.setCategory(categoryOptional.get());

        try {
            productService.saveProduct(product);
            return ResponseEntity.ok("Categoría asignada correctamente al producto");
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("El nombre del producto ya está en uso");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al actualizar la categoría del producto");
        }
    }

    @GetMapping("/categories")
    public List<Product> getProductsByCategories(@RequestParam List<Long> categoryIds) {
        return productService.getProductsByCategories(categoryIds);
    }
}

