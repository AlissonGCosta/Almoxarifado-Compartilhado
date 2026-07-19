package br.hackathon.com.example.almoxarifado_compartilhado.pedido_compra.model;

import lombok.Getter;

@Getter
public enum PedidoStatus {
    PENDENTE("Pendente"),
    APROVADO("Aprovado"),
    REJEITADO("Rejeitado"),
    EM_PROCESSAMENTO("Em Processamento"),
    ENTREGUE("Entregue"),
    CANCELADO("Cancelado");

    private final String descricao;

    PedidoStatus(String descricao) {
        this.descricao = descricao;
    }
}
