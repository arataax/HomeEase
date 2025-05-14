package com.homeease.service;

import com.homeease.dto.AvailabilityResponse;
import com.homeease.exceptions.ResourceNotFoundException;
import com.homeease.model.Product;
import com.homeease.model.Reservation;
import com.homeease.repository.ProductRepository;
import com.homeease.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ReservationRepository reservationRepository;

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

    // Método para buscar productos en el rango de fechas
    public List<Product> searchProducts(String name, LocalDate startDate, LocalDate endDate) {
        Specification<Product> spec = Specification.where(hasName(name))
                .and(isAvailableBetween(startDate, endDate));
        return productRepository.findAll(spec);
    }

    // Especificación para filtrar productos por fechas de disponibilidad
    private Specification<Product> isAvailableBetween(LocalDate startDate, LocalDate endDate) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.and(
                criteriaBuilder.lessThanOrEqualTo(root.get("availableFrom"), endDate),
                criteriaBuilder.greaterThanOrEqualTo(root.get("availableUntil"), startDate)
        );
    }

    // Especificación para filtrar por nombre
    private Specification<Product> hasName(String name) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), "%" + name.toLowerCase() + "%");
    }

    public List<Product> searchProductsByName(String name) {
        return productRepository.findByNameContainingIgnoreCase(name); // Esta es una búsqueda que no diferencia mayúsculas y minúsculas
    }

    // Método para obtener las fechas ocupadas de un producto
    public List<String> getOccupiedDates(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        // Obtener todas las reservas para ese producto
        List<Reservation> reservations = reservationRepository.findByProductId(productId);

        // Crear una lista de fechas ocupadas
        List<String> occupiedDates = new ArrayList<>();

        for (Reservation reservation : reservations) {
            LocalDate startDate = reservation.getStartDate();
            LocalDate endDate = reservation.getEndDate();

            // Agregar todas las fechas entre startDate y endDate a la lista de fechas ocupadas
            while (!startDate.isAfter(endDate)) {
                occupiedDates.add(startDate.toString());
                startDate = startDate.plusDays(1);
            }
        }

        return occupiedDates; // Devolver las fechas ocupadas
    }

    // Método para obtener las fechas disponibles de un producto
    public List<String> getAvailableDates(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        // Obtener todas las fechas ocupadas para ese producto
        List<String> occupiedDates = getOccupiedDates(productId);

        // Crear un listado de fechas disponibles (por ejemplo, fechas del mes actual o futuro)
        List<String> availableDates = new ArrayList<>();
        LocalDate today = LocalDate.now();
        LocalDate endOfMonth = today.withDayOfMonth(today.lengthOfMonth());

        while (!today.isAfter(endOfMonth)) {
            if (!occupiedDates.contains(today.toString())) {
                availableDates.add(today.toString());
            }
            today = today.plusDays(1);
        }

        return availableDates; // Devolver las fechas disponibles
    }
}

