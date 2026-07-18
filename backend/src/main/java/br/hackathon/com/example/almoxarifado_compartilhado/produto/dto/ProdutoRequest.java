package br.hackathon.com.example.almoxarifado_compartilhado.produto.dto;

import br.hackathon.com.example.almoxarifado_compartilhado.produto.enums.ProdutoStatus;
import br.hackathon.com.example.almoxarifado_compartilhado.produto.enums.ProdutoType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.util.UUID;

public record ProdutoRequest(

        @NotBlank
        String nome,

        @NotBlank
        String descricao,

        @NotNull
        @Positive
        BigDecimal quantidade,

        @NotNull
        @Positive
        BigDecimal preco,

        @NotNull
        ProdutoStatus status,

        @NotNull
        ProdutoType type,

        @NotNull
        UUID usuarioCadastrado,

        @NotNull
        UUID secretariaCadastrada

) {
}