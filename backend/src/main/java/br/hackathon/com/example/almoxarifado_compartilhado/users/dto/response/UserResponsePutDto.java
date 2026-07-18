package br.hackathon.com.example.almoxarifado_compartilhado.users.dto.response;

import org.springframework.validation.annotation.Validated;

@Validated
public record UserResponsePutDto(
        String nome,
        String email
) {
}
