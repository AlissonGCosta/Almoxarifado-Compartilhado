package br.hackathon.com.example.almoxarifado_compartilhado.pedido_transferencia.controller;

import br.hackathon.com.example.almoxarifado_compartilhado.pedido_transferencia.dto.PedidoTransferenciaPatchRequest;
import br.hackathon.com.example.almoxarifado_compartilhado.pedido_transferencia.dto.PedidoTransferenciaRequest;
import br.hackathon.com.example.almoxarifado_compartilhado.pedido_transferencia.dto.PedidoTransferenciaResponse;
import br.hackathon.com.example.almoxarifado_compartilhado.pedido_transferencia.service.PedidoTransferenciaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/v1/pedidos-transferencia")
@RequiredArgsConstructor
public class PedidoTransferenciaController {

    private final PedidoTransferenciaService service;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PedidoTransferenciaResponse create(@Valid @RequestBody PedidoTransferenciaRequest request) {
        return service.create(request);
    }

    @GetMapping
    public List<PedidoTransferenciaResponse> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public PedidoTransferenciaResponse findById(@PathVariable UUID id) {
        return service.findById(id);
    }

    @PutMapping("/{id}")
    public PedidoTransferenciaResponse update(
            @PathVariable UUID id,
            @Valid @RequestBody PedidoTransferenciaRequest request) {
        return service.update(id, request);
    }

    @PatchMapping("/{id}")
    public PedidoTransferenciaResponse patch(
            @PathVariable UUID id,
            @RequestBody PedidoTransferenciaPatchRequest request) {
        return service.patch(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        service.delete(id);
    }
}