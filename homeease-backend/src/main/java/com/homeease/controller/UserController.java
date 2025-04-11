package com.homeease.controller;

import com.homeease.dto.FavoriteRequest;
import com.homeease.model.Product;
import com.homeease.model.User;
import com.homeease.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            User registeredUser = userService.registerUser(user);
            return ResponseEntity.ok(registeredUser);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        Optional<User> authenticatedUser = userService.validateUser(user.getEmail(), user.getPassword());
        if (authenticatedUser.isPresent()) {
            System.out.println("Rol de Admin: " + authenticatedUser.get().isAdmin());
            return ResponseEntity.ok(authenticatedUser.get());  // Devuelve el usuario directamente
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales incorrectas");
        }
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userService.findAllUsers();
    }

    @PatchMapping("/makeAdmin/{id}")
    public ResponseEntity<User> makeAdmin(@PathVariable Long id, @RequestBody User updatedUser) {
        User user = userService.updateAdminRole(id, true);  // Asigna el rol de admin
        if (user == null) {
            return ResponseEntity.notFound().build(); // Si no se encuentra el usuario
        }
        return ResponseEntity.ok(user); // Devuelve el usuario actualizado
    }

    @PatchMapping("/removeAdmin/{id}")
    public ResponseEntity<User> removeAdmin(@PathVariable Long id, @RequestBody User updatedUser) {
        User user = userService.updateAdminRole(id, false);  // Quita el rol de admin
        if (user == null) {
            return ResponseEntity.notFound().build(); // Si no se encuentra el usuario
        }
        return ResponseEntity.ok(user); // Devuelve el usuario actualizado
    }

    // Agregar un producto a favoritos
    @PostMapping("/favorites/add")
    public ResponseEntity<String> addFavorite(@RequestBody FavoriteRequest favoriteRequest) {
        try {
            userService.addFavorite(favoriteRequest.getUserId(), favoriteRequest.getProductId());
            return ResponseEntity.ok("Producto agregado a favoritos");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al agregar a favoritos");
        }
    }

    // Eliminar un producto de favoritos
    @DeleteMapping("/favorites/remove/{productId}")
    public ResponseEntity<Void> removeFavorite(@PathVariable Long productId, @RequestParam Long userId) {
        try {
            userService.removeFavorite(userId, productId);  // Elimina el favorito en el servicio
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @GetMapping("/favorites")
    public ResponseEntity<List<Product>> getUserFavorites(@RequestParam Long userId) {
        List<Product> favorites = userService.getUserFavorites(userId);
        return ResponseEntity.ok(favorites);
    }
}


