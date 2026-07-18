package br.hackathon.com.example.almoxarifado_compartilhado.pedido_transferencia.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;
import java.util.UUID;

public record PedidoTransferenciaRequest(

        @NotNull
        @Size(min = 40, message = "A descrição do pedido deve ter no mínimo 40 caracteres")
        String descricaoPedido,

        @NotNull
        @Size(min = 40, message = "A razão social deve ter no mínimo 40 caracteres")
        String razaoSocial,

        @NotNull
        UUID usuarioId,

        @NotNull
        UUID secretariaId,

        @NotEmpty(message = "O pedido deve ter ao menos um item")
        List<@Valid ItemPedidoRequestPayload> itens

) {
}