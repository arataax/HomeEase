package com.homeease.repository;

import com.homeease.model.UserFavorites;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserFavoritesRepository extends JpaRepository<UserFavorites, Long> {
    boolean existsByUserIdAndProductId(Long userId, Long productId);
    Optional<UserFavorites> findByUserIdAndProductId(Long userId, Long productId);
    List<UserFavorites> findByUserId(Long userId);
}
