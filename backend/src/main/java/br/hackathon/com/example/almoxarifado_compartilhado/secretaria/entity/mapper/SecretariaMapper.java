package br.hackathon.com.example.almoxarifado_compartilhado.secretaria.entity.mapper;

import br.hackathon.com.example.almoxarifado_compartilhado.secretaria.dto.request.SecretariaRequestDto;
import br.hackathon.com.example.almoxarifado_compartilhado.secretaria.dto.response.SecretariaResponseDto;
import br.hackathon.com.example.almoxarifado_compartilhado.secretaria.entity.SecretariaEntity;
import br.hackathon.com.example.almoxarifado_compartilhado.secretaria.repository.SecretariasRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class SecretariaMapper {

    private final SecretariasRepository secretariasRepository;

    // CONVERTENDO O DTO EM RESPONSE
    public SecretariaResponseDto toResponseDto(SecretariaRequestDto dto) {

        UUID novoId = secretariasRepository.findBySigla(dto.sigla()).get().getId();
        LocalDate dataCriada = secretariasRepository.findBySigla(dto.sigla()).get().getCreatedAt();
        LocalDate update = secretariasRepository.findBySigla(dto.sigla()).get().getUpdatedAt();

        return new SecretariaResponseDto(
                novoId,
                dto.nome(),
                dto.sigla().toUpperCase(),
                dto.endereco(),
                dto.cep(),
                dataCriada,
                update

        );
    }

    public SecretariaResponseDto toResponseEntity(SecretariaEntity dto) {

        return new SecretariaResponseDto(
                dto.getId(),
                dto.getNome(),
                dto.getSigla(),
                dto.getEndereco(),
                dto.getCep(),
                dto.getCreatedAt(),
                dto.getUpdatedAt()

        );
    }



}
