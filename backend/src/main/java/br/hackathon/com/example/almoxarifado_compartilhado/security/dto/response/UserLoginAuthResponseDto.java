package br.hackathon.com.example.almoxarifado_compartilhado.security.dto.response;

public record UserLoginAuthResponseDto(
        String name,
        String email,
        String token
) {
}
