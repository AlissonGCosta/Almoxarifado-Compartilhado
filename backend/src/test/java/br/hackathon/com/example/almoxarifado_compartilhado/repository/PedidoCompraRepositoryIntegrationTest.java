package br.hackathon.com.example.almoxarifado_compartilhado.repository;

import br.hackathon.com.example.almoxarifado_compartilhado.item.entity.Item;
import br.hackathon.com.example.almoxarifado_compartilhado.item.repository.ItemRepository;
import br.hackathon.com.example.almoxarifado_compartilhado.model.PedidoCompra;
import br.hackathon.com.example.almoxarifado_compartilhado.model.PedidoStatus;
import br.hackathon.com.example.almoxarifado_compartilhado.secretaria.entity.SecretariaEntity;
import br.hackathon.com.example.almoxarifado_compartilhado.secretaria.repository.SecretariasRepository;
import br.hackathon.com.example.almoxarifado_compartilhado.users.entity.UserEntity;
import br.hackathon.com.example.almoxarifado_compartilhado.users.entity.usersEnum.UserEnum;
import br.hackathon.com.example.almoxarifado_compartilhado.users.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class PedidoCompraRepositoryIntegrationTest {

    @Autowired private PedidoCompraRepository pedidoCompraRepository;
    @Autowired private ItemRepository itemRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private SecretariasRepository secretariasRepository;

    @Test
    void persisteAuditoriaERetornaFiltrosPorStatusESecretaria() throws InterruptedException {
        SecretariaEntity secretaria = new SecretariaEntity();
        secretaria.setNome("Administração");
        secretaria.setSigla("ADM");
        secretaria.setEndereco("Rua A, 1");
        secretaria.setCep("01000-000");
        secretaria.setCreatedAt(LocalDate.now());
        secretaria.setUpdatedAt(LocalDate.now());
        secretaria = secretariasRepository.saveAndFlush(secretaria);

        UserEntity usuario = new UserEntity();
        usuario.setNome("Usuário de Teste");
        usuario.setEmail("usuario@teste.com");
        usuario.setCpf("12345678900");
        usuario.setSenha("senha");
        usuario.setRoles(UserEnum.ROLE_USER);
        usuario.setSecretaria(secretaria);
        usuario.setCreatedAt(LocalDate.now());
        usuario.setUpdatedAt(LocalDate.now());
        usuario = userRepository.saveAndFlush(usuario);

        Item produto = new Item();
        produto.setName("Caneta");
        produto.setDescription("Caneta azul");
        produto.setQuantity(100);
        produto = itemRepository.saveAndFlush(produto);

        PedidoCompra pedido = PedidoCompra.builder()
                .produto(produto)
                .nomeProduto("Caneta")
                .quantidade(new BigDecimal("5.00"))
                .preco(new BigDecimal("3.50"))
                .status(PedidoStatus.PENDENTE)
                .usuario(usuario)
                .secretaria(secretaria)
                .build();
        pedido = pedidoCompraRepository.saveAndFlush(pedido);

        assertThat(pedido.getDataCriacao()).isNotNull();
        assertThat(pedido.getDataAtualizacao()).isNotNull();
        assertThat(pedidoCompraRepository.findByStatus(PedidoStatus.PENDENTE)).contains(pedido);
        assertThat(pedidoCompraRepository.findBySecretariaId(secretaria.getId())).contains(pedido);

        var criadaEm = pedido.getDataAtualizacao();
        Thread.sleep(10);
        pedido.setDescricaoPedido("Atualizado");
        pedido = pedidoCompraRepository.saveAndFlush(pedido);

        assertThat(pedido.getDataAtualizacao()).isAfter(criadaEm);
    }
}
