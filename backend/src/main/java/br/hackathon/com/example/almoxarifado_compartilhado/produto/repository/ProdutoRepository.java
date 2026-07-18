package br.hackathon.com.example.almoxarifado_compartilhado.produto.repository;

import br.hackathon.com.example.almoxarifado_compartilhado.produto.entity.ProdutoEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ProdutoRepository extends JpaRepository<ProdutoEntity, UUID> {
}