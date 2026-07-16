package br.hackathon.com.example.almoxarifado_compartilhado.service;

import br.hackathon.com.example.almoxarifado_compartilhado.dto.PedidoCompraDTO;
import br.hackathon.com.example.almoxarifado_compartilhado.exception.BusinessException;
import br.hackathon.com.example.almoxarifado_compartilhado.exception.RessourceNotFoundException;
import br.hackathon.com.example.almoxarifado_compartilhado.item.entity.Item;
import br.hackathon.com.example.almoxarifado_compartilhado.item.repository.ItemRepository;
import br.hackathon.com.example.almoxarifado_compartilhado.model.PedidoCompra;
import br.hackathon.com.example.almoxarifado_compartilhado.model.PedidoStatus;
import br.hackathon.com.example.almoxarifado_compartilhado.repository.PedidoCompraRepository;
import br.hackathon.com.example.almoxarifado_compartilhado.secretaria.entity.SecretariaEntity;
import br.hackathon.com.example.almoxarifado_compartilhado.secretaria.repository.SecretariasRepository;
import br.hackathon.com.example.almoxarifado_compartilhado.users.entity.UserEntity;
import br.hackathon.com.example.almoxarifado_compartilhado.users.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PedidoCompraServiceTest {

    @Mock private PedidoCompraRepository pedidoCompraRepository;
    @Mock private ItemRepository itemRepository;
    @Mock private UserRepository userRepository;
    @Mock private SecretariasRepository secretariasRepository;
    @InjectMocks private PedidoCompraService service;

    @Test
    void criaPedidoValidoSempreComoPendente() {
        UUID produtoId = UUID.randomUUID();
        UUID usuarioId = UUID.randomUUID();
        UUID secretariaId = UUID.randomUUID();
        Item produto = new Item();
        produto.setId(produtoId);
        UserEntity usuario = new UserEntity();
        usuario.setId(usuarioId);
        SecretariaEntity secretaria = new SecretariaEntity();
        secretaria.setId(secretariaId);
        PedidoCompraDTO dto = dto(produtoId, usuarioId, secretariaId, PedidoStatus.APROVADO);

        when(itemRepository.findById(produtoId)).thenReturn(Optional.of(produto));
        when(userRepository.findById(usuarioId)).thenReturn(Optional.of(usuario));
        when(secretariasRepository.findById(secretariaId)).thenReturn(Optional.of(secretaria));
        when(pedidoCompraRepository.save(any(PedidoCompra.class))).thenAnswer(invocation -> {
            PedidoCompra pedido = invocation.getArgument(0);
            pedido.setIdPedidoCompra(UUID.randomUUID());
            return pedido;
        });

        PedidoCompraDTO resultado = service.criarPedido(dto);

        ArgumentCaptor<PedidoCompra> captor = ArgumentCaptor.forClass(PedidoCompra.class);
        verify(pedidoCompraRepository).save(captor.capture());
        assertThat(captor.getValue().getStatus()).isEqualTo(PedidoStatus.PENDENTE);
        assertThat(resultado.getStatus()).isEqualTo(PedidoStatus.PENDENTE);
        assertThat(resultado.getIdProduto()).isEqualTo(produtoId);
    }

    @Test
    void rejeitaPedidoSemProduto() {
        PedidoCompraDTO dto = dto(null, UUID.randomUUID(), UUID.randomUUID(), PedidoStatus.PENDENTE);

        assertThatThrownBy(() -> service.criarPedido(dto))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("Produto");
        verify(pedidoCompraRepository, never()).save(any());
    }

    @Test
    void rejeitaProdutoNaoEncontrado() {
        UUID produtoId = UUID.randomUUID();
        PedidoCompraDTO dto = dto(produtoId, UUID.randomUUID(), UUID.randomUUID(), PedidoStatus.PENDENTE);
        when(itemRepository.findById(produtoId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.criarPedido(dto))
                .isInstanceOf(RessourceNotFoundException.class)
                .hasMessageContaining("Produto não encontrado");
    }

    @Test
    void rejeitaPedidoSemUsuarioOuSecretaria() {
        UUID produtoId = UUID.randomUUID();
        Item produto = new Item();
        produto.setId(produtoId);
        when(itemRepository.findById(produtoId)).thenReturn(Optional.of(produto));

        PedidoCompraDTO semUsuario = dto(produtoId, null, UUID.randomUUID(), PedidoStatus.PENDENTE);
        assertThatThrownBy(() -> service.criarPedido(semUsuario))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("Usuário");

        UUID usuarioId = UUID.randomUUID();
        UserEntity usuario = new UserEntity();
        usuario.setId(usuarioId);
        when(userRepository.findById(usuarioId)).thenReturn(Optional.of(usuario));
        PedidoCompraDTO semSecretaria = dto(produtoId, usuarioId, null, PedidoStatus.PENDENTE);
        assertThatThrownBy(() -> service.criarPedido(semSecretaria))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("Secretaria");
    }

    @Test
    void rejeitaQuantidadeOuPrecoForaDoIntervalo() {
        PedidoCompraDTO quantidadeInvalida = dto(UUID.randomUUID(), UUID.randomUUID(), UUID.randomUUID(), PedidoStatus.PENDENTE);
        quantidadeInvalida.setQuantidade(BigDecimal.ZERO);
        PedidoCompraDTO precoInvalido = dto(UUID.randomUUID(), UUID.randomUUID(), UUID.randomUUID(), PedidoStatus.PENDENTE);
        precoInvalido.setPreco(new BigDecimal("-0.01"));

        assertThatThrownBy(() -> service.criarPedido(quantidadeInvalida)).isInstanceOf(BusinessException.class);
        assertThatThrownBy(() -> service.criarPedido(precoInvalido)).isInstanceOf(BusinessException.class);
    }

    @Test
    void exigeMotivoAoCancelarPedido() {
        PedidoCompraDTO dto = dto(UUID.randomUUID(), UUID.randomUUID(), UUID.randomUUID(), PedidoStatus.CANCELADO);
        dto.setMotivoCancelamento("   ");

        assertThatThrownBy(() -> service.atualizarPedido(UUID.randomUUID(), dto))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("Motivo do cancelamento");
        verify(pedidoCompraRepository, never()).findById(any());
    }

    @Test
    void atualizaPedidoCanceladoComMotivo() {
        UUID pedidoId = UUID.randomUUID();
        UUID produtoId = UUID.randomUUID();
        UUID usuarioId = UUID.randomUUID();
        UUID secretariaId = UUID.randomUUID();
        Item produto = new Item();
        produto.setId(produtoId);
        UserEntity usuario = new UserEntity();
        usuario.setId(usuarioId);
        SecretariaEntity secretaria = new SecretariaEntity();
        secretaria.setId(secretariaId);
        PedidoCompra pedido = PedidoCompra.builder()
                .idPedidoCompra(pedidoId)
                .produto(produto)
                .usuario(usuario)
                .secretaria(secretaria)
                .status(PedidoStatus.PENDENTE)
                .build();
        PedidoCompraDTO dto = dto(produtoId, usuarioId, secretariaId, PedidoStatus.CANCELADO);
        dto.setMotivoCancelamento(" Produto descontinuado ");

        when(pedidoCompraRepository.findById(pedidoId)).thenReturn(Optional.of(pedido));
        when(itemRepository.findById(produtoId)).thenReturn(Optional.of(produto));
        when(userRepository.findById(usuarioId)).thenReturn(Optional.of(usuario));
        when(secretariasRepository.findById(secretariaId)).thenReturn(Optional.of(secretaria));
        when(pedidoCompraRepository.save(eq(pedido))).thenReturn(pedido);

        PedidoCompraDTO resultado = service.atualizarPedido(pedidoId, dto);

        assertThat(resultado.getStatus()).isEqualTo(PedidoStatus.CANCELADO);
        assertThat(resultado.getMotivoCancelamento()).isEqualTo("Produto descontinuado");
    }

    private PedidoCompraDTO dto(UUID produtoId, UUID usuarioId, UUID secretariaId, PedidoStatus status) {
        return PedidoCompraDTO.builder()
                .idProduto(produtoId)
                .idUsuario(usuarioId)
                .idSecretaria(secretariaId)
                .nomeProduto("Papel A4")
                .descricaoProduto("Resma")
                .descricaoPedido("Reposição mensal")
                .quantidade(new BigDecimal("10.00"))
                .preco(new BigDecimal("25.50"))
                .status(status)
                .build();
    }
}
