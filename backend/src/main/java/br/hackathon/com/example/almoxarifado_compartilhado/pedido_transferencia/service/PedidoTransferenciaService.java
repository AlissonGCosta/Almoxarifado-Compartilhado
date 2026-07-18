package br.hackathon.com.example.almoxarifado_compartilhado.pedido_transferencia.service;

import br.hackathon.com.example.almoxarifado_compartilhado.itens_pedido_transferencia.dto.ItemPedidoTransferenciaResponse;
import br.hackathon.com.example.almoxarifado_compartilhado.itens_pedido_transferencia.entity.ItemPedidoTransferenciaEntity;
import br.hackathon.com.example.almoxarifado_compartilhado.itens_pedido_transferencia.repository.ItemPedidoTransferenciaRepository;
import br.hackathon.com.example.almoxarifado_compartilhado.pedido_transferencia.dto.ItemPedidoRequestPayload;
import br.hackathon.com.example.almoxarifado_compartilhado.pedido_transferencia.dto.PedidoTransferenciaPatchRequest;
import br.hackathon.com.example.almoxarifado_compartilhado.pedido_transferencia.dto.PedidoTransferenciaRequest;
import br.hackathon.com.example.almoxarifado_compartilhado.pedido_transferencia.dto.PedidoTransferenciaResponse;
import br.hackathon.com.example.almoxarifado_compartilhado.pedido_transferencia.entity.PedidoTransferenciaEntity;
import br.hackathon.com.example.almoxarifado_compartilhado.pedido_transferencia.enums.PedidoStatus;
import br.hackathon.com.example.almoxarifado_compartilhado.pedido_transferencia.repository.PedidoTransferenciaRepository;
import br.hackathon.com.example.almoxarifado_compartilhado.produto.entity.ProdutoEntity;
import br.hackathon.com.example.almoxarifado_compartilhado.produto.repository.ProdutoRepository;
import br.hackathon.com.example.almoxarifado_compartilhado.secretaria.entity.SecretariaEntity;
import br.hackathon.com.example.almoxarifado_compartilhado.secretaria.repository.SecretariasRepository;
import br.hackathon.com.example.almoxarifado_compartilhado.users.entity.UserEntity;
import br.hackathon.com.example.almoxarifado_compartilhado.users.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class PedidoTransferenciaService {

    private final PedidoTransferenciaRepository repository;
    private final ItemPedidoTransferenciaRepository itemRepository;
    private final ProdutoRepository produtoRepository;
    private final UserRepository userRepository;
    private final SecretariasRepository secretariasRepository;

    public PedidoTransferenciaService(
            PedidoTransferenciaRepository repository,
            ItemPedidoTransferenciaRepository itemRepository,
            ProdutoRepository produtoRepository,
            UserRepository userRepository,
            SecretariasRepository secretariasRepository) {

        this.repository = repository;
        this.itemRepository = itemRepository;
        this.produtoRepository = produtoRepository;
        this.userRepository = userRepository;
        this.secretariasRepository = secretariasRepository;
    }

    public PedidoTransferenciaResponse create(PedidoTransferenciaRequest request) {

        UserEntity usuario = userRepository.findById(request.usuarioId())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        SecretariaEntity secretaria = secretariasRepository.findById(request.secretariaId())
                .orElseThrow(() -> new RuntimeException("Secretaria não encontrada"));

        List<ProdutoEntity> produtosCarregados = new ArrayList<>();
        List<String> produtosSemEstoque = new ArrayList<>();

        for (ItemPedidoRequestPayload itemPayload : request.itens()) {

            ProdutoEntity produto = produtoRepository.findById(itemPayload.produtoId())
                    .orElseThrow(() -> new RuntimeException("Produto não encontrado: " + itemPayload.produtoId()));

            produtosCarregados.add(produto);

            if (produto.getQuantidade().compareTo(itemPayload.quantidade()) < 0) {
                produtosSemEstoque.add(produto.getNome());
            }
        }

        boolean estoqueSuficiente = produtosSemEstoque.isEmpty();

        PedidoTransferenciaEntity pedido = PedidoTransferenciaEntity.builder()
                .descricaoPedido(request.descricaoPedido())
                .razaoSocial(request.razaoSocial())
                .usuario(usuario)
                .secretaria(secretaria)
                .status(estoqueSuficiente ? PedidoStatus.ABERTO : PedidoStatus.CANCELADO)
                .motivoCancelamento(estoqueSuficiente
                        ? null
                        : "Estoque insuficiente para o(s) produto(s): " + String.join(", ", produtosSemEstoque))
                .build();

        pedido = repository.save(pedido);

        List<ItemPedidoTransferenciaEntity> itensCriados = new ArrayList<>();

        if (estoqueSuficiente) {
            for (int i = 0; i < request.itens().size(); i++) {

                ItemPedidoRequestPayload itemPayload = request.itens().get(i);
                ProdutoEntity produto = produtosCarregados.get(i);

                ItemPedidoTransferenciaEntity item = ItemPedidoTransferenciaEntity.builder()
                        .pedido(pedido)
                        .produto(produto)
                        .quantidade(itemPayload.quantidade())
                        .build();

                itensCriados.add(itemRepository.save(item));
            }
        }

        return toResponse(pedido, itensCriados);
    }

    public List<PedidoTransferenciaResponse> findAll() {
        return repository.findAll()
                .stream()
                .map(pedido -> toResponse(pedido, itemRepository.findByPedidoId(pedido.getId())))
                .toList();
    }

    public PedidoTransferenciaResponse findById(UUID id) {

        PedidoTransferenciaEntity pedido = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));

        List<ItemPedidoTransferenciaEntity> itens = itemRepository.findByPedidoId(id);

        return toResponse(pedido, itens);
    }

    public PedidoTransferenciaResponse update(UUID id, PedidoTransferenciaRequest request) {

        PedidoTransferenciaEntity pedido = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));

        UserEntity usuario = userRepository.findById(request.usuarioId())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        SecretariaEntity secretaria = secretariasRepository.findById(request.secretariaId())
                .orElseThrow(() -> new RuntimeException("Secretaria não encontrada"));

        pedido.setDescricaoPedido(request.descricaoPedido());
        pedido.setRazaoSocial(request.razaoSocial());
        pedido.setUsuario(usuario);
        pedido.setSecretaria(secretaria);

        pedido = repository.save(pedido);

        List<ItemPedidoTransferenciaEntity> itens = itemRepository.findByPedidoId(id);

        return toResponse(pedido, itens);
    }

    public PedidoTransferenciaResponse patch(UUID id, PedidoTransferenciaPatchRequest request) {

        PedidoTransferenciaEntity pedido = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));

        if (request.descricaoPedido() != null) {
            pedido.setDescricaoPedido(request.descricaoPedido());
        }

        if (request.razaoSocial() != null) {
            pedido.setRazaoSocial(request.razaoSocial());
        }

        if (request.status() != null) {
            pedido.setStatus(request.status());
        }

        if (request.usuarioId() != null) {
            UserEntity usuario = userRepository.findById(request.usuarioId())
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
            pedido.setUsuario(usuario);
        }

        if (request.secretariaId() != null) {
            SecretariaEntity secretaria = secretariasRepository.findById(request.secretariaId())
                    .orElseThrow(() -> new RuntimeException("Secretaria não encontrada"));
            pedido.setSecretaria(secretaria);
        }

        pedido = repository.save(pedido);

        List<ItemPedidoTransferenciaEntity> itens = itemRepository.findByPedidoId(id);

        return toResponse(pedido, itens);
    }

    public void delete(UUID id) {

        PedidoTransferenciaEntity pedido = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));

        List<ItemPedidoTransferenciaEntity> itens = itemRepository.findByPedidoId(id);
        itemRepository.deleteAll(itens);

        repository.delete(pedido);
    }

    private PedidoTransferenciaResponse toResponse(
            PedidoTransferenciaEntity pedido,
            List<ItemPedidoTransferenciaEntity> itens) {

        List<ItemPedidoTransferenciaResponse> itensResponse = itens.stream()
                .map(item -> new ItemPedidoTransferenciaResponse(
                        item.getId(),
                        item.getPedido().getId(),
                        item.getProduto().getId(),
                        item.getQuantidade()))
                .toList();

        return new PedidoTransferenciaResponse(
                pedido.getId(),
                pedido.getDescricaoPedido(),
                pedido.getRazaoSocial(),
                pedido.getStatus(),
                pedido.getMotivoCancelamento(),
                pedido.getUsuario().getId(),
                pedido.getSecretaria().getId(),
                itensResponse
        );
    }
}