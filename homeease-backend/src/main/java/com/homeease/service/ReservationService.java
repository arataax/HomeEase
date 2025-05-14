package com.homeease.service;

import com.homeease.exceptions.ResourceNotFoundException;
import com.homeease.model.Product;
import com.homeease.model.Reservation;
import com.homeease.model.User;
import com.homeease.repository.ProductRepository;
import com.homeease.repository.ReservationRepository;
import com.homeease.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    public Reservation createReservation(Long userId, Long productId, LocalDate startDate, LocalDate endDate) {
        // Obtener el producto de la base de datos
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        // Obtener el usuario de la base de datos
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Crear una nueva instancia de reserva
        Reservation reservation = new Reservation();
        reservation.setUser(user);
        reservation.setProduct(product);
        reservation.setStartDate(startDate);
        reservation.setEndDate(endDate);

        // Guardar la reserva en la base de datos
        return reservationRepository.save(reservation);
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
        // Obtener todas las fechas ocupadas para ese producto
        List<String> occupiedDates = getOccupiedDates(productId);

        // Crear un listado de fechas disponibles (por ejemplo, fechas del mes actual o futuro)
        List<String> availableDates = new ArrayList<>();
        LocalDate today = LocalDate.now();
        LocalDate endOfMonth = today.withDayOfMonth(today.lengthOfMonth());

        // Crear un bucle para recorrer las fechas
        while (!today.isAfter(endOfMonth)) {
            if (!occupiedDates.contains(today.toString())) {
                availableDates.add(today.toString());
            }
            today = today.plusDays(1);
        }

        return availableDates; // Devolver las fechas disponibles
    }

    public List<Reservation> findReservationsByUserId(Long userId) {
        return reservationRepository.findByUserId(userId);
    }
}
