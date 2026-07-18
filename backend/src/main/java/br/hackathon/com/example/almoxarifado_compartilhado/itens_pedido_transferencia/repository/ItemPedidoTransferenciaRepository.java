package br.hackathon.com.example.almoxarifado_compartilhado.itens_pedido_transferencia.repository;

import br.hackathon.com.example.almoxarifado_compartilhado.itens_pedido_transferencia.entity.ItemPedidoTransferenciaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ItemPedidoTransferenciaRepository extends JpaRepository<ItemPedidoTransferenciaEntity, UUID> {

    List<ItemPedidoTransferenciaEntity> findByPedidoId(UUID pedidoId);
}