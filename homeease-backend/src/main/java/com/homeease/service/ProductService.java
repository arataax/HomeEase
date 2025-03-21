package com.homeease.service;

import com.homeease.model.Product;
import com.homeease.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public Product saveProduct(Product product) {
        // Validar si el nombre del producto ya existe
        if (product.getId() == null && productRepository.existsByName(product.getName())) {
            throw new DataIntegrityViolationException("El nombre del producto ya está en uso");
        }
        return productRepository.save(product);
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    public boolean deleteProduct(Long id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public List<Product> getProductsByCategories(List<Long> categoryIds) {
        return productRepository.findByCategoryIdIn(categoryIds);
    }
}

