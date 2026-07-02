package br.hackathon.com.example.almoxarifado_compartilhado.dto;

public record ItemResponse(
        Long id,
        String name,
        String description,
        Integer quantity
) {
}