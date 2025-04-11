package com.homeease.controller;

import com.homeease.model.Category;
import com.homeease.repository.CategoryRepository;
import com.homeease.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "http://localhost:3000") // Ajusta si es necesario
public class CategoryController {

    @Autowired
    private
    CategoryRepository categoryRepository;

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public List<Category> getAllCategories() {
        return categoryRepository.findAll(); // Asegúrate de que esto retorne todas las categorías
    }

    // Endpoint para agregar una categoría con imagen
    @PostMapping("/add-category")
    public ResponseEntity<Category> addCategory(
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("image") MultipartFile image) {

        try {
            // Guardamos la imagen y obtenemos el nombre del archivo
            String fileName = saveImage(image);

            // Creamos la nueva categoría
            Category category = new Category(name, description, fileName);

            // Guardamos la categoría en la base de datos
            categoryService.saveCategory(name, description, fileName);

            return ResponseEntity.ok(category);  // Respondemos con la categoría creada
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();  // Manejo de errores
        }
    }


    // Método para guardar la imagen en la carpeta de upload
    private String saveImage(MultipartFile image) throws IOException {
        String uploadDirectory = "uploads/";  // Aquí se define el directorio en el que se guardarán las imágenes
        File uploadDir = new File(uploadDirectory);

        if (!uploadDir.exists()) {
            uploadDir.mkdir(); // Si el directorio no existe, lo crea
        }

        String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
        Path path = Paths.get(uploadDirectory + fileName);

        // Guardamos el archivo en el directorio
        Files.write(path, image.getBytes());
        return fileName;
    }


    // Método para eliminar una categoría
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build(); // Respuesta HTTP 204: No Content
    }
}
