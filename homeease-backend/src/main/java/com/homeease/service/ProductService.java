package com.homeease.service;

import com.homeease.dto.AvailabilityResponse;
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

    // Método para obtener la disponibilidad del producto
    public AvailabilityResponse getProductAvailability(Long productId) throws Exception {
        // Obtener el producto
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new Exception("Producto no encontrado"));

        // Fechas disponibles
        LocalDate availableFrom = product.getAvailableFrom();
        LocalDate availableUntil = product.getAvailableUntil();

        // Consultar las reservas
        List<Reservation> reservations = reservationRepository.findByProductId(productId);
        List<LocalDate> occupiedDates = new ArrayList<>();

        for (Reservation reservation : reservations) {
            occupiedDates.add(reservation.getReservedDate());  // Añadir las fechas reservadas
        }

        // Generar la lista de fechas disponibles entre available_from y available_until
        List<LocalDate> availableDates = new ArrayList<>();
        for (LocalDate date = availableFrom; !date.isAfter(availableUntil); date = date.plusDays(1)) {
            availableDates.add(date);
        }

        // Retornar las fechas disponibles y ocupadas
        return new AvailabilityResponse(availableDates, occupiedDates);
    }
}

