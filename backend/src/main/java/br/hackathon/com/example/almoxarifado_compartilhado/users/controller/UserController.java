package br.hackathon.com.example.almoxarifado_compartilhado.users.controller;

import br.hackathon.com.example.almoxarifado_compartilhado.users.dto.request.UserRequestDto;
import br.hackathon.com.example.almoxarifado_compartilhado.users.dto.response.UserResponseDto;
import br.hackathon.com.example.almoxarifado_compartilhado.users.entity.mapper.UserMapper;
import br.hackathon.com.example.almoxarifado_compartilhado.users.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("v1/users")
@RequiredArgsConstructor
@Validated
public class UserController {

    private final UserService userService;
    private final UserMapper userMapper;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponseDto criarUser(@RequestBody @Valid UserRequestDto dto) {
        userService.criarUsuario(dto);
        return userMapper.toResponseDto(dto);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<UserResponseDto> listarUsers() {
        return userService.listarUsuarios();
    }

}
