package br.hackathon.com.example.almoxarifado_compartilhado.repository;

import br.hackathon.com.example.almoxarifado_compartilhado.entity.Item;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ItemRepository extends JpaRepository<Item, Long> {

}