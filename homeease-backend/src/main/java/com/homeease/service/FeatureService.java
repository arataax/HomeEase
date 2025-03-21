package com.homeease.service;

import com.homeease.model.Feature;
import com.homeease.model.Product;
import com.homeease.repository.FeatureRepository;
import com.homeease.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FeatureService {

    @Autowired
    private FeatureRepository featureRepository;

    @Autowired
    private ProductRepository productRepository;  // Agregar el repositorio de productos

    public List<Feature> getFeaturesByProduct(Long productId) {
        return featureRepository.findByProductId(productId);
    }

    public Feature addFeatureToProduct(Long productId, Feature feature) {
        Optional<Product> product = productRepository.findById(productId);
        if (product.isPresent()) {
            feature.setProduct(product.get());
            return featureRepository.save(feature);
        }
        return null;
    }

    public boolean deleteFeature(Long id) {
        if (featureRepository.existsById(id)) {
            featureRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public Feature updateFeature(Long id, Feature featureDetails) {
        Optional<Feature> existingFeature = featureRepository.findById(id);
        if (existingFeature.isPresent()) {
            Feature feature = existingFeature.get();
            feature.setName(featureDetails.getName());
            feature.setIcon(featureDetails.getIcon());
            return featureRepository.save(feature);
        }
        return null;
    }
}


