package com.homeease.controller;

import com.homeease.exceptions.ResourceNotFoundException;
import com.homeease.model.Product;
import com.homeease.model.Reservation;
import com.homeease.repository.ProductRepository;
import com.homeease.repository.ReservationRepository;
import com.homeease.service.EmailService;
import com.homeease.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;


@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "http://localhost:3000") // Ajusta si es necesario
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    @Autowired
    private ProductRepository productRepository ;

    @Autowired
    private ReservationRepository reservationRepository ;

    @Autowired
    private EmailService emailService;

    // Endpoint para crear una nueva reserva
    @PostMapping("/add")
    public ResponseEntity<Reservation> createReservation(@RequestBody Reservation reservation) {
        // Recupera el producto por su ID
        Product product = productRepository.findById(reservation.getProduct().getId())
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        // Llamamos al servicio para crear la reserva
        Reservation createdReservation = reservationService.createReservation(
                reservation.getUser().getId(),
                reservation.getProduct().getId(),
                reservation.getStartDate(),
                reservation.getEndDate()
        );

        // Enviar correo de confirmación
        emailService.sendConfirmationEmail(
                reservation.getUser().getEmail(),
                product.getName(),
                reservation.getStartDate().toString(),
                reservation.getEndDate().toString()
        );


        return ResponseEntity.ok(createdReservation);
    }

    // Método para obtener las fechas ocupadas de un producto
    @GetMapping("/{productId}/occupied-dates")
    public ResponseEntity<List<String>> getOccupiedDates(@PathVariable Long productId) {
        List<String> occupiedDates = reservationService.getOccupiedDates(productId);
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

    @GetMapping("/user/{userId}/reservations")
    public ResponseEntity<List<Reservation>> getUserReservations(@PathVariable Long userId) {
        List<Reservation> reservations = reservationService.findReservationsByUserId(userId);
        if (reservations.isEmpty()) {
            return ResponseEntity.noContent().build(); // Retorna un estado 204 si no hay reservas
        }
        return ResponseEntity.ok(reservations); // Retorna las reservas encontradas
    }

    @DeleteMapping("/cancel-reservation/{id}")
    public ResponseEntity<String> cancelReservation(@PathVariable Long id) {
        // Verificar si la reserva existe
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id " + id));

        // Eliminar la reserva
        reservationRepository.delete(reservation);

        // Devolver una respuesta de éxito
        return ResponseEntity.ok("Reserva eliminada con éxito");
    }
}