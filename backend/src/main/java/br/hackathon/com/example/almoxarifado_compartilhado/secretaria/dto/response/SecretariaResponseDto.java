package br.hackathon.com.example.almoxarifado_compartilhado.secretaria.dto.response;


import java.time.LocalDate;
import java.util.UUID;

public record SecretariaResponseDto(
        UUID id,
        String nome,
        String sigla,
        String endereco,
        String cep,
        LocalDate createAt,
        LocalDate updatedAt
) {
}
