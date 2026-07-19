package br.hackathon.com.example.almoxarifado_compartilhado.pedido_compra.model;

import br.hackathon.com.example.almoxarifado_compartilhado.item.entity.Item;
import br.hackathon.com.example.almoxarifado_compartilhado.secretaria.entity.SecretariaEntity;
import br.hackathon.com.example.almoxarifado_compartilhado.users.entity.UserEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "pedidos_compra")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PedidoCompra {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id_pedido_compra", updatable = false, nullable = false)
    private UUID idPedidoCompra;

    @NotNull(message = "Produto é obrigatório")
    @ManyToOne(fetch = jakarta.persistence.FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_produto", nullable = false)
    private Item produto;

    @NotBlank(message = "Nome do produto é obrigatório")
    @Column(name = "nome_produto", nullable = false)
    private String nomeProduto;

    @Column(name = "descricao_produto")
    private String descricaoProduto;

    @Column(name = "descricao_pedido")
    private String descricaoPedido;

    @NotNull(message = "Quantidade é obrigatória")
    @DecimalMin(value = "0.01", message = "Quantidade deve ser maior que zero")
    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal quantidade;

    @NotNull(message = "Preço é obrigatório")
    @DecimalMin(value = "0.00", inclusive = true, message = "Preço deve ser maior ou igual a zero")
    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal preco;

    @NotNull(message = "Status é obrigatório")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private PedidoStatus status;

    @NotNull(message = "Usuário é obrigatório")
    @ManyToOne(fetch = jakarta.persistence.FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_usuario", nullable = false)
    private UserEntity usuario;

    @NotNull(message = "Secretaria é obrigatória")
    @ManyToOne(fetch = jakarta.persistence.FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_secretaria", nullable = false)
    private SecretariaEntity secretaria;

    @Column(name = "motivo_cancelamento")
    private String motivoCancelamento;

    @Column(name = "data_criacao", nullable = false, updatable = false)
    private LocalDateTime dataCriacao;

    @Column(name = "data_atualizacao", nullable = false)
    private LocalDateTime dataAtualizacao;

    @PrePersist
    void prePersist() {
        LocalDateTime agora = LocalDateTime.now();
        dataCriacao = agora;
        dataAtualizacao = agora;
    }

    @PreUpdate
    void preUpdate() {
        dataAtualizacao = LocalDateTime.now();
    }
}
