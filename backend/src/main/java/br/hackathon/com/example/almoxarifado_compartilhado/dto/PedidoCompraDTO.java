package br.hackathon.com.example.almoxarifado_compartilhado.dto;

import br.hackathon.com.example.almoxarifado_compartilhado.model.PedidoStatus;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PedidoCompraDTO {

    private UUID idPedidoCompra;

    @NotNull(message = "Produto é obrigatório")
    private UUID idProduto;

    @NotBlank(message = "Nome do produto é obrigatório")
    private String nomeProduto;

    private String descricaoProduto;
    private String descricaoPedido;

    @NotNull(message = "Quantidade é obrigatória")
    @DecimalMin(value = "0.01", message = "Quantidade deve ser maior que zero")
    private BigDecimal quantidade;

    @NotNull(message = "Preço é obrigatório")
    @DecimalMin(value = "0.00", inclusive = true, message = "Preço deve ser maior ou igual a zero")
    private BigDecimal preco;

    @NotNull(message = "Status é obrigatório")
    @Builder.Default
    private PedidoStatus status = PedidoStatus.PENDENTE;

    @NotNull(message = "Usuário é obrigatório")
    private UUID idUsuario;

    @NotNull(message = "Secretaria é obrigatória")
    private UUID idSecretaria;

    private String motivoCancelamento;
}
