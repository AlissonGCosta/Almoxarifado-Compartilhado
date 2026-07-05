package br.hackathon.com.example.almoxarifado_compartilhado.secretaria.service;

import br.hackathon.com.example.almoxarifado_compartilhado.exception.ConflictException;
import br.hackathon.com.example.almoxarifado_compartilhado.secretaria.dto.request.SecretariaRequestDto;
import br.hackathon.com.example.almoxarifado_compartilhado.secretaria.dto.response.SecretariaResponseDto;
import br.hackathon.com.example.almoxarifado_compartilhado.secretaria.entity.SecretariaEntity;
import br.hackathon.com.example.almoxarifado_compartilhado.secretaria.repository.SecretariasRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SecretariaService {

    private final SecretariasRepository secretariasRepository;

    // CRIANDO A SECRETARIA E VALIDANDO SE É A UNICA EM BANCO
    public void criarSecretaria(SecretariaRequestDto dto){

        // VALIDAÇÃO SIMPLES
        if(secretariasRepository.findBySigla(dto.sigla()).isPresent()){
            throw new ConflictException("secretaria Ja existente");
        }

        // PASSANDO OS DADOS DO DTO PARA A ENTIDADE
        SecretariaEntity secretaria = new SecretariaEntity();
        secretaria.setNome(dto.nome());
        secretaria.setSigla(dto.sigla());
        secretaria.setEndereco(dto.endereco());
        secretaria.setCep(dto.cep());
        secretaria.setCreatedAt(LocalDate.now());
        secretaria.setUpdatedAt(LocalDate.now());

        // SALVANDO NO REPOSITORY
        secretariasRepository.save(secretaria);

    }

    // METODO PARA LISTAR AS SECRETARIAS
    public List<SecretariaResponseDto> listarSecretarias(){

        // MAP SIMPLES
       return secretariasRepository.findAll().stream()
               .map(secretaria -> new SecretariaResponseDto(
                       secretaria.getId(),
                       secretaria.getNome(),
                       secretaria.getSigla(),
                       secretaria.getEndereco(),
                       secretaria.getCep(),
                       secretaria.getCreatedAt()
               )).toList();
   }
}
