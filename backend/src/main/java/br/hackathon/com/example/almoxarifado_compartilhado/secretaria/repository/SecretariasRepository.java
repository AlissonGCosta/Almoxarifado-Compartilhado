package br.hackathon.com.example.almoxarifado_compartilhado.secretaria.repository;

import br.hackathon.com.example.almoxarifado_compartilhado.secretaria.entity.SecretariaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface SecretariasRepository extends JpaRepository<SecretariaEntity, UUID> {

    Optional<SecretariaEntity> findBySigla(String sigla);
}
