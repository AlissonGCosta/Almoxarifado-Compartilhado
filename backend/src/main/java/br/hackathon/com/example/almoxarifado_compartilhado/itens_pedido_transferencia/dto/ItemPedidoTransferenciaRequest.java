package br.hackathon.com.example.almoxarifado_compartilhado.itens_pedido_transferencia.dto;

import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.UUID;

public record ItemPedidoTransferenciaRequest(

        @NotNull
        UUID pedidoTransferencia,

        @NotNull
        UUID produto,

        @NotNull
        BigDecimal quantidade

) {
}