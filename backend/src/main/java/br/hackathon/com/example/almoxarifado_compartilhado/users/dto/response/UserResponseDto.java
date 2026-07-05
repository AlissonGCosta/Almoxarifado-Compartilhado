package br.hackathon.com.example.almoxarifado_compartilhado.users.dto.response;

import br.hackathon.com.example.almoxarifado_compartilhado.users.entity.usersEnum.UserEnum;

import java.time.LocalDate;
import java.util.UUID;

public record UserResponseDto(
        UUID id,
        String siglaSecretaria,
        String nome,
        String email,
        LocalDate creatAt,
        String roles
) {
}
