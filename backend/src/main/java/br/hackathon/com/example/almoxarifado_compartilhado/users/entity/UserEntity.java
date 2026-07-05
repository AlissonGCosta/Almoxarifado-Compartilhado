package br.hackathon.com.example.almoxarifado_compartilhado.users.entity;

import br.hackathon.com.example.almoxarifado_compartilhado.secretaria.entity.SecretariaEntity;
import br.hackathon.com.example.almoxarifado_compartilhado.users.entity.usersEnum.UserEnum;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "users")
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false,  unique = true)
    private String cpf;

    @Column(nullable = false)
    private String senha;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private UserEnum roles;

    @ManyToOne
    @JoinColumn(name = "secretaria_id", nullable = false)
    private SecretariaEntity secretaria;

    @Column(nullable = false)
    private LocalDate createdAt;

    @Column(nullable = false)
    private LocalDate updatedAt;


}
