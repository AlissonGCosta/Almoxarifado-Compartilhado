package br.hackathon.com.example.almoxarifado_compartilhado.exception;

public class RessourceNotFoundException extends RuntimeException {
    public RessourceNotFoundException(String message) {
        super(message);
    }
}
