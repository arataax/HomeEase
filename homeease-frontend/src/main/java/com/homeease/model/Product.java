package com.homeease.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "El nombre no puede ser nulo")
    private String name;

    @NotNull(message = "La descripción no puede ser nula")
    private String description;

    @NotNull(message = "El precio no puede ser nulo")
    private Double price;

    @NotNull(message = "El stock no puede ser nulo")
    private Integer stock;

    @NotNull(message = "Tenes que agregar una imagen")
    private String imageUrl;

    @ManyToOne
    @JoinColumn(name = "category_id", referencedColumnName = "id")
    private Category category;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore  // Esto evitará que se serialicen las características cuando se obtenga un producto
    private List<Feature> features = new ArrayList<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public @NotNull(message = "El nombre no puede ser nulo") String getName() {
        return name;
    }

    public void setName(@NotNull(message = "El nombre no puede ser nulo") String name) {
        this.name = name;
    }

    public @NotNull(message = "La descripción no puede ser nula") String getDescription() {
        return description;
    }

    public void setDescription(@NotNull(message = "La descripción no puede ser nula") String description) {
        this.description = description;
    }

    public @NotNull(message = "El precio no puede ser nulo") Double getPrice() {
        return price;
    }

    public void setPrice(@NotNull(message = "El precio no puede ser nulo") Double price) {
        this.price = price;
    }

    public @NotNull(message = "El stock no puede ser nulo") Integer getStock() {
        return stock;
    }

    public void setStock(@NotNull(message = "El stock no puede ser nulo") Integer stock) {
        this.stock = stock;
    }

    public @NotNull(message = "Tenes que agregar una imagen") String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(@NotNull(message = "Tenes que agregar una imagen") String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public List<Feature> getFeatures() {
        return features;
    }

    public void setFeatures(List<Feature> features) {
        this.features = features;
    }
}
