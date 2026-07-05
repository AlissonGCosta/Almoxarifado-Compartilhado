package br.hackathon.com.example.almoxarifado_compartilhado.users.service;

import br.hackathon.com.example.almoxarifado_compartilhado.exception.BusinessException;
import br.hackathon.com.example.almoxarifado_compartilhado.exception.ConflictException;
import br.hackathon.com.example.almoxarifado_compartilhado.users.dto.request.UserRequestDto;
import br.hackathon.com.example.almoxarifado_compartilhado.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ValidateUser {

    private final UserRepository userRepository;

    public void validateUser(UserRequestDto dto){

        if(userRepository.findByEmail(dto.email()).isPresent()){
            throw new ConflictException("email ja cadastrado");
        }

        if(userRepository.findByCpf(dto.cpf()).isPresent()){
            throw new ConflictException("cpf ja cadastrado");
        }

        // validate camps
        if(dto.senha().length() < 8){
            throw new BusinessException("senha muito pequena");
        }

        if(dto.senha().length() > 32){
            throw new BusinessException("senha muito longa");
        }


    }
}

