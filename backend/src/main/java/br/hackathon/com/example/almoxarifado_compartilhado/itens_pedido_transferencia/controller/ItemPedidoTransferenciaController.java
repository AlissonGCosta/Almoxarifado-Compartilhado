package br.hackathon.com.example.almoxarifado_compartilhado.itens_pedido_transferencia.controller;

import br.hackathon.com.example.almoxarifado_compartilhado.itens_pedido_transferencia.dto.ItemPedidoTransferenciaResponse;
import br.hackathon.com.example.almoxarifado_compartilhado.itens_pedido_transferencia.service.ItemPedidoTransferenciaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/v1/itens-pedido-transferencia")
@RequiredArgsConstructor
public class ItemPedidoTransferenciaController {

    private final ItemPedidoTransferenciaService service;

    @GetMapping
    public ResponseEntity<List<ItemPedidoTransferenciaResponse>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ItemPedidoTransferenciaResponse> findById(@PathVariable UUID id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}