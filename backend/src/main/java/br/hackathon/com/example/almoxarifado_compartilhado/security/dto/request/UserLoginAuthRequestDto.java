package br.hackathon.com.example.almoxarifado_compartilhado.security.dto.request;

import jakarta.validation.constraints.NotBlank;
import org.springframework.validation.annotation.Validated;

@Validated
public record UserLoginAuthRequestDto(
        @NotBlank
        String email,

        @NotBlank
        String password
) {
}
