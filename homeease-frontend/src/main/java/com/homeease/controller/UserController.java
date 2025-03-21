package com.homeease.controller;

import com.homeease.model.User;
import com.homeease.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

}
