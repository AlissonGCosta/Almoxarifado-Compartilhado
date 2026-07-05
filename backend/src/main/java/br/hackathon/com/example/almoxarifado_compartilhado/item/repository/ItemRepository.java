package br.hackathon.com.example.almoxarifado_compartilhado.item.repository;

import br.hackathon.com.example.almoxarifado_compartilhado.item.entity.Item;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ItemRepository extends JpaRepository<Item, Long> {

}