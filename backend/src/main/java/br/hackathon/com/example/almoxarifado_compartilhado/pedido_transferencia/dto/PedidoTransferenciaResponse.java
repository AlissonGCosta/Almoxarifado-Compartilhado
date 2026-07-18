package br.hackathon.com.example.almoxarifado_compartilhado.pedido_transferencia.dto;

import br.hackathon.com.example.almoxarifado_compartilhado.itens_pedido_transferencia.dto.ItemPedidoTransferenciaResponse;
import br.hackathon.com.example.almoxarifado_compartilhado.pedido_transferencia.enums.PedidoStatus;

import java.util.List;
import java.util.UUID;

public record PedidoTransferenciaResponse(

        UUID id,
        String descricaoPedido,
        String razaoSocial,
        PedidoStatus status,
        String motivoCancelamento,
        UUID usuarioId,
        UUID secretariaId,
        List<ItemPedidoTransferenciaResponse> itens

) {
}