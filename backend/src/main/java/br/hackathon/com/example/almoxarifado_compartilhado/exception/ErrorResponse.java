package br.hackathon.com.example.almoxarifado_compartilhado.exception;

import java.time.LocalDateTime;

public record ErrorResponse(

        LocalDateTime timestamp,
        int status,
        String error,
        String message

) {
}