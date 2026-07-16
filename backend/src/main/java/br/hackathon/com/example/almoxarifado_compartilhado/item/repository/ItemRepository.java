package br.hackathon.com.example.almoxarifado_compartilhado.item.repository;

import br.hackathon.com.example.almoxarifado_compartilhado.item.entity.Item;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ItemRepository extends JpaRepository<Item, UUID> {

}
