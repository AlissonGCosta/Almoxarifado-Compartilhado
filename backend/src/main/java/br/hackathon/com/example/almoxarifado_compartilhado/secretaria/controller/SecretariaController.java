package br.hackathon.com.example.almoxarifado_compartilhado.secretaria.controller;

import br.hackathon.com.example.almoxarifado_compartilhado.secretaria.dto.request.SecretariaRequestDto;
import br.hackathon.com.example.almoxarifado_compartilhado.secretaria.dto.response.SecretariaResponseDto;
import br.hackathon.com.example.almoxarifado_compartilhado.secretaria.entity.mapper.SecretariaMapper;
import br.hackathon.com.example.almoxarifado_compartilhado.secretaria.service.SecretariaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("v1/secretarias")
@RequiredArgsConstructor
@Validated
public class SecretariaController {

    private final SecretariaService secretariaService;
    private final SecretariaMapper mapper;


    // METODO PARA CRIAR A SECRETARIA
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SecretariaResponseDto criarSecretaria(@RequestBody @Valid SecretariaRequestDto dto) {

        secretariaService.criarSecretaria(dto);

        return mapper.toResponseDto(dto);
    }

    // METODO PARA LISTAR TODAS AS SECRETARIAS CADASTRADAS
    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<SecretariaResponseDto> listarSecretarias(){
        return secretariaService.listarSecretarias();
    }
}
