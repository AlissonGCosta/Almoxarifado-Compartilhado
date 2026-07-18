package br.hackathon.com.example.almoxarifado_compartilhado.pedido_transferencia.dto;

import br.hackathon.com.example.almoxarifado_compartilhado.pedido_transferencia.enums.PedidoStatus;

import java.util.UUID;

public record PedidoTransferenciaPatchRequest(
        String descricaoPedido,
        String razaoSocial,
        PedidoStatus status,
        UUID usuarioId,
        UUID secretariaId
) {
}