package com.homeease.exceptions;

public class ResourceNotFoundException extends RuntimeException {

    // Constructor que recibe un mensaje de error
    public ResourceNotFoundException(String message) {
        super(message); // Pasa el mensaje al constructor de la clase base RuntimeException
    }
}
