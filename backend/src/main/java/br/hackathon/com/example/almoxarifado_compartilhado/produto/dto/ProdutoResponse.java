package br.hackathon.com.example.almoxarifado_compartilhado.produto.dto;

import br.hackathon.com.example.almoxarifado_compartilhado.produto.enums.ProdutoStatus;
import br.hackathon.com.example.almoxarifado_compartilhado.produto.enums.ProdutoType;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record ProdutoResponse(

        UUID id,

        String nome,

        String descricao,

        BigDecimal quantidade,

        BigDecimal preco,

        ProdutoStatus status,

        ProdutoType type,

        UUID usuarioCadastrado,

        UUID secretariaCadastrada,

        LocalDate createdAt,

        LocalDate updatedAt

) {
}