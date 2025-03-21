package com.homeease.service;

import com.homeease.model.Category;
import com.homeease.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.io.File;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    public String saveImage(MultipartFile image) throws IOException {
        String uploadDirectory = "uploads/";  // Directorio donde se guardarán las imágenes
        File uploadDir = new File(uploadDirectory);

        if (!uploadDir.exists()) {
            uploadDir.mkdir();  // Si el directorio no existe, lo crea
        }

        // Nombre del archivo con la marca de tiempo para evitar colisiones
        String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
        Path path = Paths.get(uploadDirectory + fileName);

        // Guardamos el archivo en el directorio 'uploads'
        Files.write(path, image.getBytes());

        // Devuelve solo el nombre del archivo para almacenarlo en la base de datos
        return fileName;
    }

    public Category saveCategory(String name, String description, String fileName) {
        Category category = new Category(name, description, fileName);
        return categoryRepository.save(category);
    }
}
