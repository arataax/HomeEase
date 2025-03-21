package com.homeease.controller;

import com.homeease.model.Feature;
import com.homeease.service.FeatureService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class FeatureController {

    @Autowired
    private FeatureService featureService;

    @GetMapping("/{id}/features")
    public List<Feature> getProductFeatures(@PathVariable Long id) {
        return featureService.getFeaturesByProduct(id);
    }

    @PostMapping("/{id}/features")
    public ResponseEntity<Feature> addFeatureToProduct(@PathVariable Long id, @RequestBody Feature newFeature) {
        Feature feature = featureService.addFeatureToProduct(id, newFeature);
        if (feature != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(feature);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @DeleteMapping("/{id}/features")
    public ResponseEntity<Void> deleteFeature(@PathVariable Long id) {
        boolean isDeleted = featureService.deleteFeature(id);
        return isDeleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/features")
    public ResponseEntity<Feature> updateFeature(
            @PathVariable Long id,
            @RequestBody Feature featureDetails
    ) {
        Feature updatedFeature = featureService.updateFeature(id, featureDetails);
        return updatedFeature != null
                ? ResponseEntity.ok(updatedFeature)
                : ResponseEntity.notFound().build();
    }
}

