package br.hackathon.com.example.almoxarifado_compartilhado.secretaria.entity;

import br.hackathon.com.example.almoxarifado_compartilhado.users.entity.UserEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;


@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "secretarias")
public class SecretariaEntity {

   @Id
   @GeneratedValue(strategy = GenerationType.UUID)
   private UUID id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private String sigla;

    @Column(nullable = false)
    private String endereco;

    @Column(nullable = false)
    private String cep;

    @Column(nullable = false)
    private LocalDate createdAt;

    @Column(nullable = false)
    private LocalDate updatedAt;

    @OneToMany
    private List<UserEntity> user = new ArrayList<>();
}
