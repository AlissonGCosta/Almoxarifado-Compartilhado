package br.hackathon.com.example.almoxarifado_compartilhado.exception;

import java.util.UUID;

public class ItemNotFoundException extends RuntimeException {

    public ItemNotFoundException(UUID id) {
        super("Item com ID " + id + " não encontrado.");
    }

}
