package br.hackathon.com.example.almoxarifado_compartilhado.users.dto.request;

import org.hibernate.validator.constraints.br.CPF;
import org.springframework.validation.annotation.Validated;

@Validated
public record UserRequestDto(
    String siglaSecretaria,
    String nome,
    String email,
    @CPF(message = "CPF invalido")
    String cpf,
    String senha
) {
}
