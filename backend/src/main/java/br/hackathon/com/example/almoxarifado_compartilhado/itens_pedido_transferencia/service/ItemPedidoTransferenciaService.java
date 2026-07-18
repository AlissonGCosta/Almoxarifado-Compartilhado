package br.hackathon.com.example.almoxarifado_compartilhado.itens_pedido_transferencia.service;

import br.hackathon.com.example.almoxarifado_compartilhado.itens_pedido_transferencia.dto.ItemPedidoTransferenciaPatchRequest;
import br.hackathon.com.example.almoxarifado_compartilhado.itens_pedido_transferencia.dto.ItemPedidoTransferenciaRequest;
import br.hackathon.com.example.almoxarifado_compartilhado.itens_pedido_transferencia.dto.ItemPedidoTransferenciaResponse;
import br.hackathon.com.example.almoxarifado_compartilhado.itens_pedido_transferencia.entity.ItemPedidoTransferenciaEntity;
import br.hackathon.com.example.almoxarifado_compartilhado.itens_pedido_transferencia.repository.ItemPedidoTransferenciaRepository;
import br.hackathon.com.example.almoxarifado_compartilhado.pedido_transferencia.entity.PedidoTransferenciaEntity;
import br.hackathon.com.example.almoxarifado_compartilhado.pedido_transferencia.repository.PedidoTransferenciaRepository;
import br.hackathon.com.example.almoxarifado_compartilhado.produto.entity.ProdutoEntity;
import br.hackathon.com.example.almoxarifado_compartilhado.produto.repository.ProdutoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ItemPedidoTransferenciaService {

    private final ItemPedidoTransferenciaRepository repository;
    private final PedidoTransferenciaRepository pedidoRepository;
    private final ProdutoRepository produtoRepository;

    public ItemPedidoTransferenciaService(
            ItemPedidoTransferenciaRepository repository,
            PedidoTransferenciaRepository pedidoRepository,
            ProdutoRepository produtoRepository) {

        this.repository = repository;
        this.pedidoRepository = pedidoRepository;
        this.produtoRepository = produtoRepository;
    }

    public ItemPedidoTransferenciaResponse create(ItemPedidoTransferenciaRequest request) {

        PedidoTransferenciaEntity pedido = pedidoRepository.findById(request.pedidoTransferencia())
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));

        ProdutoEntity produto = produtoRepository.findById(request.produto())
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));

        ItemPedidoTransferenciaEntity item = ItemPedidoTransferenciaEntity.builder()
                .pedido(pedido)
                .produto(produto)
                .quantidade(request.quantidade())
                .build();

        return toResponse(repository.save(item));
    }

    public List<ItemPedidoTransferenciaResponse> findAll() {
        return repository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public ItemPedidoTransferenciaResponse findById(UUID id) {

        ItemPedidoTransferenciaEntity item = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item não encontrado"));

        return toResponse(item);
    }

    public ItemPedidoTransferenciaResponse update(UUID id, ItemPedidoTransferenciaRequest request) {

        ItemPedidoTransferenciaEntity item = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item não encontrado"));

        PedidoTransferenciaEntity pedido = pedidoRepository.findById(request.pedidoTransferencia())
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));

        ProdutoEntity produto = produtoRepository.findById(request.produto())
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));

        item.setPedido(pedido);
        item.setProduto(produto);
        item.setQuantidade(request.quantidade());

        return toResponse(repository.save(item));
    }

    public ItemPedidoTransferenciaResponse patch(UUID id, ItemPedidoTransferenciaPatchRequest request) {

        ItemPedidoTransferenciaEntity item = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item não encontrado"));

        if (request.pedidoTransferencia() != null) {
            PedidoTransferenciaEntity pedido = pedidoRepository.findById(request.pedidoTransferencia())
                    .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));
            item.setPedido(pedido);
        }

        if (request.produto() != null) {
            ProdutoEntity produto = produtoRepository.findById(request.produto())
                    .orElseThrow(() -> new RuntimeException("Produto não encontrado"));
            item.setProduto(produto);
        }

        if (request.quantidade() != null) {
            item.setQuantidade(request.quantidade());
        }

        return toResponse(repository.save(item));
    }

    public void delete(UUID id) {

        ItemPedidoTransferenciaEntity item = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item não encontrado"));

        repository.delete(item);
    }

    private ItemPedidoTransferenciaResponse toResponse(ItemPedidoTransferenciaEntity item) {

        return new ItemPedidoTransferenciaResponse(
                item.getId(),
                item.getPedido().getId(),
                item.getProduto().getId(),
                item.getQuantidade()
        );
    }
}