package br.hackathon.com.example.almoxarifado_compartilhado.users.dto.request;

import org.springframework.validation.annotation.Validated;

@Validated
public record UserRequestPutDto(
        String nome,
        String email
) {
}
