package br.hackathon.com.example.almoxarifado_compartilhado.controller;

import br.hackathon.com.example.almoxarifado_compartilhado.dto.PedidoCompraDTO;
import br.hackathon.com.example.almoxarifado_compartilhado.model.PedidoStatus;
import br.hackathon.com.example.almoxarifado_compartilhado.service.PedidoCompraService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/pedidos-compra")
@RequiredArgsConstructor
@Tag(name = "Pedidos de Compra", description = "Gerenciamento de pedidos de compra")
public class PedidoCompraController {

    private final PedidoCompraService pedidoCompraService;

    @Operation(summary = "Criar pedido de compra")
    @PostMapping
    public ResponseEntity<PedidoCompraDTO> criarPedido(@Valid @RequestBody PedidoCompraDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(pedidoCompraService.criarPedido(dto));
    }

    @Operation(summary = "Listar todos os pedidos de compra")
    @GetMapping
    public ResponseEntity<List<PedidoCompraDTO>> listarPedidos() {
        return ResponseEntity.ok(pedidoCompraService.listarPedidos());
    }

    @Operation(summary = "Obter pedido de compra por ID")
    @GetMapping("/{id}")
    public ResponseEntity<PedidoCompraDTO> obterPedido(@PathVariable UUID id) {
        return ResponseEntity.ok(pedidoCompraService.obterPedido(id));
    }

    @Operation(summary = "Listar pedidos de compra por status")
    @GetMapping("/status/{status}")
    public ResponseEntity<List<PedidoCompraDTO>> listarPorStatus(@PathVariable PedidoStatus status) {
        return ResponseEntity.ok(pedidoCompraService.listarPorStatus(status));
    }

    @Operation(summary = "Listar pedidos de compra por secretaria")
    @GetMapping("/secretaria/{secretariaId}")
    public ResponseEntity<List<PedidoCompraDTO>> listarPorSecretaria(@PathVariable UUID secretariaId) {
        return ResponseEntity.ok(pedidoCompraService.listarPorSecretaria(secretariaId));
    }

    @Operation(summary = "Atualizar pedido de compra")
    @PutMapping("/{id}")
    public ResponseEntity<PedidoCompraDTO> atualizarPedido(@PathVariable UUID id,
                                                            @Valid @RequestBody PedidoCompraDTO dto) {
        return ResponseEntity.ok(pedidoCompraService.atualizarPedido(id, dto));
    }

    @Operation(summary = "Excluir pedido de compra")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarPedido(@PathVariable UUID id) {
        pedidoCompraService.deletarPedido(id);
        return ResponseEntity.noContent().build();
    }
}
