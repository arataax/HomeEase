package com.homeease.repository;

import com.homeease.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface ReservationRepository extends JpaRepository<Reservation, Long> { // Método para obtener todas las reservas de un producto
    public List<Reservation> findByProductId(Long productId);
    public List<Reservation> findByUserId(Long userId);
}
