package br.hackathon.com.example.almoxarifado_compartilhado.itens_pedido_transferencia.entity;

import br.hackathon.com.example.almoxarifado_compartilhado.pedido_transferencia.entity.PedidoTransferenciaEntity;
import br.hackathon.com.example.almoxarifado_compartilhado.produto.entity.ProdutoEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "itens_pedido_transferencia")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ItemPedidoTransferenciaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "pedido_id", nullable = false)
    private PedidoTransferenciaEntity pedido;

    @ManyToOne
    @JoinColumn(name = "produto_id", nullable = false)
    private ProdutoEntity produto;

    @Column(nullable = false)
    private BigDecimal quantidade;
}