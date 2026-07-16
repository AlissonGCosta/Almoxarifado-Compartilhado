package br.hackathon.com.example.almoxarifado_compartilhado.repository;

import br.hackathon.com.example.almoxarifado_compartilhado.model.PedidoCompra;
import br.hackathon.com.example.almoxarifado_compartilhado.model.PedidoStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PedidoCompraRepository extends JpaRepository<PedidoCompra, UUID> {
    List<PedidoCompra> findByStatus(PedidoStatus status);
    List<PedidoCompra> findByUsuarioId(UUID usuarioId);
    List<PedidoCompra> findBySecretariaId(UUID secretariaId);
    List<PedidoCompra> findByStatusAndSecretariaId(PedidoStatus status, UUID secretariaId);
}
