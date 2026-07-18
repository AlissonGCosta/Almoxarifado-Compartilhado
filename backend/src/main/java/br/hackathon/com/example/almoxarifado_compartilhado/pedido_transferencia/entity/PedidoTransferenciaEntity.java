package br.hackathon.com.example.almoxarifado_compartilhado.pedido_transferencia.entity;

import br.hackathon.com.example.almoxarifado_compartilhado.pedido_transferencia.enums.PedidoStatus;
import br.hackathon.com.example.almoxarifado_compartilhado.secretaria.entity.SecretariaEntity;
import br.hackathon.com.example.almoxarifado_compartilhado.users.entity.UserEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "pedido_transferencia")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PedidoTransferenciaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String descricaoPedido;

    @Column(nullable = false)
    private String razaoSocial;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PedidoStatus status;

    private String motivoCancelamento;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private UserEntity usuario;

    @ManyToOne
    @JoinColumn(name = "secretaria_id", nullable = false)
    private SecretariaEntity secretaria;

}