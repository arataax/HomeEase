package com.homeease.repository;

import com.homeease.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;


import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    boolean existsByName(String name);
    List<Product> findByCategoryIdIn(List<Long> categoryIds);
    List<Product> findByNameContainingIgnoreCase(String name);
}


