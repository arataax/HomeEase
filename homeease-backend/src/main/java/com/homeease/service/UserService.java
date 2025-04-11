package com.homeease.service;

import com.homeease.model.Product;
import com.homeease.model.User;
import com.homeease.model.UserFavorites;
import com.homeease.repository.ProductRepository;
import com.homeease.repository.UserFavoritesRepository;
import com.homeease.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserFavoritesRepository userFavoritesRepository;

    public User registerUser(User user) throws Exception {
        if (userRepository.findByEmail(user.getEmail()) != null) {
            throw new Exception("Este email ya está registrado");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public Optional<User> validateUser(String email, String password) {
        User user = userRepository.findByEmail(email);
        if (user != null && passwordEncoder.matches(password, user.getPassword())) {
            return Optional.of(user);
        }
        return Optional.empty();
    }

    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    public User updateAdminRole(Long id, boolean isAdmin) {
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()) {
            user.get().setAdmin(isAdmin); // Cambiar el rol a admin o no admin
            userRepository.save(user.get()); // Guarda el usuario con el nuevo rol
            userRepository.flush(); // Fuerza la actualización inmediata
            return user.get(); // Retorna el usuario actualizado
        }
        return null; // Si el usuario no existe, devuelve null
    }

    // Método para agregar un producto a los favoritos
    public void addFavorite(Long userId, Long productId) throws Exception {
        Optional<User> user = userRepository.findById(userId);
        Optional<Product> product = productRepository.findById(productId);

        if (user.isEmpty() || product.isEmpty()) {
            throw new Exception("Usuario o producto no encontrados");
        }

        // Verificar si el producto ya está marcado como favorito
        if (userFavoritesRepository.existsByUserIdAndProductId(userId, productId)) {
            throw new Exception("El producto ya está en favoritos");
        }

        UserFavorites userFavorites = new UserFavorites(user.get(), product.get());
        userFavoritesRepository.save(userFavorites);
    }

    // Método para eliminar un producto de los favoritos
    public void removeFavorite(Long userId, Long productId) throws Exception {
        // Buscar y eliminar el producto de los favoritos del usuario
        UserFavorites userFavorite = userFavoritesRepository.findByUserIdAndProductId(userId, productId)
                .orElseThrow(() -> new Exception("El producto no está en los favoritos del usuario"));
        userFavoritesRepository.delete(userFavorite);  // Eliminarlo de la base de datos
    }

    // Método para obtener los productos favoritos del usuario
    public List<Product> getUserFavorites(Long userId) {
        // Buscar los favoritos del usuario en la base de datos
        List<UserFavorites> userFavorites = userFavoritesRepository.findByUserId(userId);
        List<Product> favoriteProducts = new ArrayList<>();

        // Recorrer los favoritos y agregar los productos a la lista
        for (UserFavorites favorite : userFavorites) {
            favoriteProducts.add(favorite.getProduct());
        }

        return favoriteProducts;
    }


}
