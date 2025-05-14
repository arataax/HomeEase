package com.homeease.service;

import com.homeease.model.Rating;
import com.homeease.repository.RatingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RatingService {

    @Autowired
    private RatingRepository ratingRepository;

    public Rating createRating(Rating rating) {
        // se podría validar aquí que el usuario haya finalizado la reserva
        return ratingRepository.save(rating);
    }

    public List<Rating> getRatingsByProduct(Long productId) {
        return ratingRepository.findByProductId(productId);
    }

    public List<Rating> getRatingsByUser(Long userId) {
        return ratingRepository.findByUserId(userId);
    }

    public Double getAverageRating(Long productId) {
        return ratingRepository.findAverageRatingByProductId(productId);
    }

    public Long getRatingCount(Long productId) {
        return ratingRepository.countByProductId(productId);
    }
}
