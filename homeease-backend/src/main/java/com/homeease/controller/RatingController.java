package com.homeease.controller;

import com.homeease.model.Rating;
import com.homeease.service.RatingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ratings")
public class RatingController {

    @Autowired
    private RatingService ratingService;

    @PostMapping
    public ResponseEntity<Rating> createRating(@RequestBody Rating rating) {
        Rating savedRating = ratingService.createRating(rating);
        return new ResponseEntity<>(savedRating, HttpStatus.CREATED);
    }

    @GetMapping("/product/{productId}")
    public List<Rating> getRatingsByProduct(@PathVariable Long productId) {
        return ratingService.getRatingsByProduct(productId);
    }

    @GetMapping("/user/{userId}")
    public List<Rating> getRatingsByUser(@PathVariable Long userId) {
        return ratingService.getRatingsByUser(userId);
    }

    @GetMapping("/product/{productId}/average")
    public Double getAverageRating(@PathVariable Long productId) {
        return ratingService.getAverageRating(productId);
    }

    @GetMapping("/product/{productId}/count")
    public Long getRatingCount(@PathVariable Long productId) {
        return ratingService.getRatingCount(productId);
    }
}