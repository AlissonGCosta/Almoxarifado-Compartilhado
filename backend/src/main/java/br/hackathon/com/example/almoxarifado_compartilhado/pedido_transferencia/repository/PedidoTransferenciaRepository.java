package br.hackathon.com.example.almoxarifado_compartilhado.pedido_transferencia.repository;

import br.hackathon.com.example.almoxarifado_compartilhado.pedido_transferencia.entity.PedidoTransferenciaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PedidoTransferenciaRepository extends JpaRepository<PedidoTransferenciaEntity, UUID> {
}