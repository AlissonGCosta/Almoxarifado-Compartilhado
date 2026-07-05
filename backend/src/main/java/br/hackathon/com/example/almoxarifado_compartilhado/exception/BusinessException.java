package br.hackathon.com.example.almoxarifado_compartilhado.exception;

public class BusinessException extends RuntimeException {
    public BusinessException(String message) {
        super(message);
    }
}
