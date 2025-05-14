package com.homeease.controller;

import com.homeease.dto.CategoryUpdateRequest;
import com.homeease.exceptions.ResourceNotFoundException;
import com.homeease.model.Category;
import com.homeease.model.Product;
import com.homeease.model.Reservation;
import com.homeease.repository.CategoryRepository;
import com.homeease.repository.ProductRepository;
import com.homeease.repository.ReservationRepository;
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
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:3000") // Ajusta el origen según sea necesario
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository ;

    @Autowired
    private ReservationRepository reservationRepository ;

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

    // Endpoint para realizar la búsqueda de productos
    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate
    ) {
        List<Product> products = productService.searchProducts(name, startDate, endDate);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/search/suggestions")
    public List<Product> searchProducts(@RequestParam String name) {
        return productService.searchProductsByName(name);
    }

    // Método para obtener las fechas ocupadas de un producto
    @GetMapping("/{productId}/occupied-dates")
    public ResponseEntity<List<String>> getOccupiedDates(@PathVariable Long productId) {
        List<String> occupiedDates = productService.getOccupiedDates(productId);
        return ResponseEntity.ok(occupiedDates);
    }

    // Método para obtener las fechas disponibles de un producto
    @GetMapping("/{productId}/available-dates")
    public ResponseEntity<List<String>> getAvailableDates(@PathVariable Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        // Obtener las reservas para este producto
        List<Reservation> reservations = reservationRepository.findByProductId(productId);

        // Creamos una lista para las fechas disponibles
        List<String> availableDates = new ArrayList<>();

        // Recorremos las fechas disponibles según available_from y available_until
        LocalDate startDate = product.getAvailableFrom();
        LocalDate endDate = product.getAvailableUntil();

        while (!startDate.isAfter(endDate)) {
            // Verificar si la fecha está ocupada (compara con las fechas de las reservas)
            boolean isOccupied = false;

            for (Reservation reservation : reservations) {
                LocalDate reservationStartDate = reservation.getStartDate();
                LocalDate reservationEndDate = reservation.getEndDate();

                // Si la fecha de disponibilidad está dentro de las fechas de la reserva
                if (!startDate.isBefore(reservationStartDate) && !startDate.isAfter(reservationEndDate)) {
                    isOccupied = true;
                    break;  // Ya encontramos que la fecha está ocupada, no es necesario seguir buscando
                }
            }

            // Si no está ocupada, la agregamos a las fechas disponibles
            if (!isOccupied) {
                availableDates.add(startDate.toString());
            }

            // Siguiente día
            startDate = startDate.plusDays(1);
        }

        return ResponseEntity.ok(availableDates);
    }
}

