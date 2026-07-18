package br.hackathon.com.example.almoxarifado_compartilhado.pedido_transferencia.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.util.UUID;

public record ItemPedidoRequestPayload(

        @NotNull
        UUID produtoId,

        @NotNull
        @Positive
        BigDecimal quantidade

) {
}