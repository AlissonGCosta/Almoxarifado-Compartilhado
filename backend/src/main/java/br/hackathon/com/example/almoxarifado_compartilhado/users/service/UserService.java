package br.hackathon.com.example.almoxarifado_compartilhado.users.service;

import br.hackathon.com.example.almoxarifado_compartilhado.config.PasswordConfig;
import br.hackathon.com.example.almoxarifado_compartilhado.exception.BusinessException;
import br.hackathon.com.example.almoxarifado_compartilhado.exception.RessourceNotFoundException;
import br.hackathon.com.example.almoxarifado_compartilhado.secretaria.repository.SecretariasRepository;
import br.hackathon.com.example.almoxarifado_compartilhado.users.dto.request.UserRequestDto;
import br.hackathon.com.example.almoxarifado_compartilhado.users.dto.request.UserRequestPasswordDto;
import br.hackathon.com.example.almoxarifado_compartilhado.users.dto.request.UserRequestPutDto;
import br.hackathon.com.example.almoxarifado_compartilhado.users.dto.response.UserResponseDto;
import br.hackathon.com.example.almoxarifado_compartilhado.users.entity.UserEntity;
import br.hackathon.com.example.almoxarifado_compartilhado.users.entity.usersEnum.UserEnum;
import br.hackathon.com.example.almoxarifado_compartilhado.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final ValidateUser validate;
    private final PasswordConfig passwordConfig;
    private final SecretariasRepository secretariasRepository;

    public void criarUsuario(UserRequestDto dto){

       var sec = secretariasRepository.findBySigla(dto.siglaSecretaria())
                       .orElseThrow(() -> new RessourceNotFoundException("Secretaria não cadastrada"));

        validate.validateUser(dto);

        UserEntity userEntity = new UserEntity();
        userEntity.setNome(dto.nome());
        userEntity.setEmail(dto.email());
        userEntity.setCpf(dto.cpf());
        userEntity.setSenha(passwordConfig.passwordEncoder().encode(dto.senha()));
        userEntity.setRoles(UserEnum.ROLE_USER);
        userEntity.setSecretaria(sec);
        userEntity.setCreatedAt(LocalDate.now());
        userEntity.setUpdatedAt(LocalDate.now());

        userRepository.save(userEntity);
    }

    public List<UserResponseDto> listarUsuarios(){

      return userRepository.findAll().stream()
                .map(usuarios -> new UserResponseDto(
                        usuarios.getId(),
                        usuarios.getSecretaria().getSigla(),
                        usuarios.getNome(),
                        usuarios.getEmail(),
                        usuarios.getCreatedAt(),
                        usuarios.getRoles().name()

                )).toList();
    }
    public void alterarUsuarios(UUID id, UserRequestPutDto dto) {

        UserEntity user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("usuario não encontrado"));

        user.setNome(dto.nome());
        user.setEmail(dto.email());

        userRepository.save(user);

    }

    public void alterarSenha(UUID id, UserRequestPasswordDto dto) {

        UserEntity user = userRepository.findById(id)
                .orElseThrow(() -> new RessourceNotFoundException("usuario n?o encontrad" + id));

        if(!passwordConfig.passwordEncoder().matches(dto.senhaAtual(),  user.getSenha())) {
            throw new BusinessException("senha antiga n?o reconhecida");
        }

        user.setSenha(passwordConfig.passwordEncoder().encode(dto.senhaNova()));

        userRepository.save(user);

    }
}
