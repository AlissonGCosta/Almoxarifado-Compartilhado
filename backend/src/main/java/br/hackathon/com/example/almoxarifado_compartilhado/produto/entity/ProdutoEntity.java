package br.hackathon.com.example.almoxarifado_compartilhado.produto.entity;

import br.hackathon.com.example.almoxarifado_compartilhado.produto.enums.ProdutoStatus;
import br.hackathon.com.example.almoxarifado_compartilhado.produto.enums.ProdutoType;
import br.hackathon.com.example.almoxarifado_compartilhado.secretaria.entity.SecretariaEntity;
import br.hackathon.com.example.almoxarifado_compartilhado.users.entity.UserEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "produtos")
public class ProdutoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private String descricao;

    @Column(nullable = false)
    private BigDecimal quantidade;

    @Column(nullable = false)
    private BigDecimal preco;

    @Column(nullable = false, updatable = false)
    private LocalDate createdAt;

    @Column(nullable = false)
    private LocalDate updatedAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProdutoStatus status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProdutoType type;

    @ManyToOne
    @JoinColumn(name = "usuario_cadastrado", nullable = false)
    private UserEntity usuarioCadastrado;

    @ManyToOne
    @JoinColumn(name = "secretaria_cadastrada", nullable = false)
    private SecretariaEntity secretariaCadastrada;

    @PrePersist
    protected void onCreate() {
        LocalDate now = LocalDate.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDate.now();
    }
}