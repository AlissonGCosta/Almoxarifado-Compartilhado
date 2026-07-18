package br.hackathon.com.example.almoxarifado_compartilhado.itens_pedido_transferencia.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record ItemPedidoTransferenciaPatchRequest(
        UUID pedidoTransferencia,
        UUID produto,
        BigDecimal quantidade
) {
}