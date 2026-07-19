package br.hackathon.com.example.almoxarifado_compartilhado.security.controller;

import br.hackathon.com.example.almoxarifado_compartilhado.security.dto.request.UserLoginAuthRequestDto;
import br.hackathon.com.example.almoxarifado_compartilhado.security.dto.response.UserLoginAuthResponseDto;
import br.hackathon.com.example.almoxarifado_compartilhado.security.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/auth")
@RequiredArgsConstructor
@Validated
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @ResponseStatus(HttpStatus.OK)
    public UserLoginAuthResponseDto login(@RequestBody @Valid UserLoginAuthRequestDto dto){
        return  authService.login(dto);
    }
}
