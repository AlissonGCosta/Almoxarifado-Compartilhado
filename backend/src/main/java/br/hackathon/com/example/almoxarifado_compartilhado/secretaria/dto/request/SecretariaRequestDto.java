package br.hackathon.com.example.almoxarifado_compartilhado.secretaria.dto.request;

import jakarta.validation.constraints.NotBlank;
import org.springframework.validation.annotation.Validated;

@Validated
public record SecretariaRequestDto(
        @NotBlank(message = "Nome é obrigatório")
        String nome,

        @NotBlank(message = "Sigla é obrigatória")
        String sigla,

        @NotBlank(message = "Endereço é obrigatório")
        String endereco,

        @NotBlank(message = "CEP é obrigatório")
        String cep
) {
}
