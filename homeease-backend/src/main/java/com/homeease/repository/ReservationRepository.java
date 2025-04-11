package com.homeease.repository;

import com.homeease.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByProductId(Long productId); // Método para obtener todas las reservas de un producto
}
