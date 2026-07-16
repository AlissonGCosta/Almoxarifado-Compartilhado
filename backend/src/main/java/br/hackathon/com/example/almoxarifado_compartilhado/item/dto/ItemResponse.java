package br.hackathon.com.example.almoxarifado_compartilhado.item.dto;

import java.util.UUID;

public record ItemResponse(
        UUID id,
        String name,
        String description,
        Integer quantity
) {
}
