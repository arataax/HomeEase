package com.homeease.repository;

import com.homeease.model.Feature;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeatureRepository extends JpaRepository<Feature, Long> {
    List<Feature> findByProductId(Long productId);  // Buscar características por ID de producto
}

