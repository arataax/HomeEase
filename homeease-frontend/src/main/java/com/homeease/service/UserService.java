package com.homeease.service;

import com.homeease.model.User;
import com.homeease.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

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

}
