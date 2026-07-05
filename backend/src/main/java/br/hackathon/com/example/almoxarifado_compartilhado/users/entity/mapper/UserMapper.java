package br.hackathon.com.example.almoxarifado_compartilhado.users.entity.mapper;

import br.hackathon.com.example.almoxarifado_compartilhado.users.dto.request.UserRequestDto;
import br.hackathon.com.example.almoxarifado_compartilhado.users.dto.response.UserResponseDto;
import br.hackathon.com.example.almoxarifado_compartilhado.users.entity.UserEntity;
import br.hackathon.com.example.almoxarifado_compartilhado.users.entity.usersEnum.UserEnum;
import br.hackathon.com.example.almoxarifado_compartilhado.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class UserMapper {

    private final UserRepository userRepository;

    public UserResponseDto toResponseDto(UserRequestDto dto) {

        LocalDate userDate = userRepository.findByCpf(dto.cpf()).get().getCreatedAt();
        UUID id = userRepository.findByCpf(dto.cpf()).get().getId();
        UserEnum userEnum = userRepository.findByCpf(dto.cpf()).get().getRoles();

        return new UserResponseDto(
                id,
                dto.siglaSecretaria(),
                dto.nome(),
                dto.email(),
                userDate,
                userEnum.name()

        );
    }
}
