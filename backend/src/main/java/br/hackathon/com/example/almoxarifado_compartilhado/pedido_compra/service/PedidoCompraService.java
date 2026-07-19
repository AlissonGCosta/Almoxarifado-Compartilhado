package br.hackathon.com.example.almoxarifado_compartilhado.pedido_compra.service;

import br.hackathon.com.example.almoxarifado_compartilhado.pedido_compra.dto.PedidoCompraDTO;
import br.hackathon.com.example.almoxarifado_compartilhado.exception.BusinessException;
import br.hackathon.com.example.almoxarifado_compartilhado.exception.RessourceNotFoundException;
import br.hackathon.com.example.almoxarifado_compartilhado.item.entity.Item;
import br.hackathon.com.example.almoxarifado_compartilhado.item.repository.ItemRepository;
import br.hackathon.com.example.almoxarifado_compartilhado.pedido_compra.model.PedidoCompra;
import br.hackathon.com.example.almoxarifado_compartilhado.pedido_compra.model.PedidoStatus;
import br.hackathon.com.example.almoxarifado_compartilhado.pedido_compra.repository.PedidoCompraRepository;
import br.hackathon.com.example.almoxarifado_compartilhado.secretaria.entity.SecretariaEntity;
import br.hackathon.com.example.almoxarifado_compartilhado.secretaria.repository.SecretariasRepository;
import br.hackathon.com.example.almoxarifado_compartilhado.users.entity.UserEntity;
import br.hackathon.com.example.almoxarifado_compartilhado.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class PedidoCompraService {

    private final PedidoCompraRepository pedidoCompraRepository;
    private final ItemRepository itemRepository;
    private final UserRepository userRepository;
    private final SecretariasRepository secretariasRepository;

    public PedidoCompraDTO criarPedido(PedidoCompraDTO dto) {
        validarValores(dto);

        PedidoCompra pedido = PedidoCompra.builder()
                .produto(buscarProduto(dto.getIdProduto()))
                .nomeProduto(dto.getNomeProduto())
                .descricaoProduto(dto.getDescricaoProduto())
                .descricaoPedido(dto.getDescricaoPedido())
                .quantidade(dto.getQuantidade())
                .preco(dto.getPreco())
                .status(PedidoStatus.PENDENTE)
                .usuario(buscarUsuario(dto.getIdUsuario()))
                .secretaria(buscarSecretaria(dto.getIdSecretaria()))
                .build();

        return paraDto(pedidoCompraRepository.save(pedido));
    }

    public PedidoCompraDTO atualizarPedido(UUID id, PedidoCompraDTO dto) {
        validarValores(dto);
        validarCancelamento(dto);

        PedidoCompra pedido = buscarPedido(id);
        pedido.setProduto(buscarProduto(dto.getIdProduto()));
        pedido.setNomeProduto(dto.getNomeProduto());
        pedido.setDescricaoProduto(dto.getDescricaoProduto());
        pedido.setDescricaoPedido(dto.getDescricaoPedido());
        pedido.setQuantidade(dto.getQuantidade());
        pedido.setPreco(dto.getPreco());
        pedido.setStatus(dto.getStatus());
        pedido.setUsuario(buscarUsuario(dto.getIdUsuario()));
        pedido.setSecretaria(buscarSecretaria(dto.getIdSecretaria()));
        pedido.setMotivoCancelamento(dto.getStatus() == PedidoStatus.CANCELADO
                ? dto.getMotivoCancelamento().trim()
                : null);

        return paraDto(pedidoCompraRepository.save(pedido));
    }

    @Transactional(readOnly = true)
    public PedidoCompraDTO obterPedido(UUID id) {
        return paraDto(buscarPedido(id));
    }

    @Transactional(readOnly = true)
    public List<PedidoCompraDTO> listarPedidos() {
        return pedidoCompraRepository.findAll().stream().map(this::paraDto).toList();
    }

    @Transactional(readOnly = true)
    public List<PedidoCompraDTO> listarPorStatus(PedidoStatus status) {
        return pedidoCompraRepository.findByStatus(status).stream().map(this::paraDto).toList();
    }

    @Transactional(readOnly = true)
    public List<PedidoCompraDTO> listarPorSecretaria(UUID secretariaId) {
        return pedidoCompraRepository.findBySecretariaId(secretariaId).stream().map(this::paraDto).toList();
    }

    public void deletarPedido(UUID id) {
        pedidoCompraRepository.delete(buscarPedido(id));
    }

    private PedidoCompra buscarPedido(UUID id) {
        return pedidoCompraRepository.findById(id)
                .orElseThrow(() -> new RessourceNotFoundException("Pedido de compra não encontrado: " + id));
    }

    private Item buscarProduto(UUID idProduto) {
        if (idProduto == null) {
            throw new BusinessException("Produto é obrigatório");
        }
        return itemRepository.findById(idProduto)
                .orElseThrow(() -> new RessourceNotFoundException("Produto não encontrado: " + idProduto));
    }

    private UserEntity buscarUsuario(UUID idUsuario) {
        if (idUsuario == null) {
            throw new BusinessException("Usuário é obrigatório");
        }
        return userRepository.findById(idUsuario)
                .orElseThrow(() -> new RessourceNotFoundException("Usuário não encontrado: " + idUsuario));
    }

    private SecretariaEntity buscarSecretaria(UUID idSecretaria) {
        if (idSecretaria == null) {
            throw new BusinessException("Secretaria é obrigatória");
        }
        return secretariasRepository.findById(idSecretaria)
                .orElseThrow(() -> new RessourceNotFoundException("Secretaria não encontrada: " + idSecretaria));
    }

    private void validarValores(PedidoCompraDTO dto) {
        if (dto == null) {
            throw new BusinessException("Dados do pedido são obrigatórios");
        }
        if (dto.getNomeProduto() == null || dto.getNomeProduto().isBlank()) {
            throw new BusinessException("Nome do produto é obrigatório");
        }
        if (dto.getQuantidade() == null || dto.getQuantidade().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessException("Quantidade deve ser maior que zero");
        }
        if (dto.getPreco() == null || dto.getPreco().compareTo(BigDecimal.ZERO) < 0) {
            throw new BusinessException("Preço deve ser maior ou igual a zero");
        }
    }

    private void validarCancelamento(PedidoCompraDTO dto) {
        if (dto.getStatus() == null) {
            throw new BusinessException("Status é obrigatório");
        }
        if (dto.getStatus() == PedidoStatus.CANCELADO
                && (dto.getMotivoCancelamento() == null || dto.getMotivoCancelamento().isBlank())) {
            throw new BusinessException("Motivo do cancelamento é obrigatório para pedidos cancelados");
        }
    }

    private PedidoCompraDTO paraDto(PedidoCompra pedido) {
        return PedidoCompraDTO.builder()
                .idPedidoCompra(pedido.getIdPedidoCompra())
                .idProduto(pedido.getProduto().getId())
                .nomeProduto(pedido.getNomeProduto())
                .descricaoProduto(pedido.getDescricaoProduto())
                .descricaoPedido(pedido.getDescricaoPedido())
                .quantidade(pedido.getQuantidade())
                .preco(pedido.getPreco())
                .status(pedido.getStatus())
                .idUsuario(pedido.getUsuario().getId())
                .idSecretaria(pedido.getSecretaria().getId())
                .motivoCancelamento(pedido.getMotivoCancelamento())
                .build();
    }
}
