package br.hackathon.com.example.almoxarifado_compartilhado.users.dto.request;

public record UserRequestPasswordDto (
        String senhaAtual,
        String senhaNova
){
}
