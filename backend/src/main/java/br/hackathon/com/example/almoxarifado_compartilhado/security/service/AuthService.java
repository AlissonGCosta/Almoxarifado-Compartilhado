package br.hackathon.com.example.almoxarifado_compartilhado.security.service;

import br.hackathon.com.example.almoxarifado_compartilhado.security.dto.request.UserLoginAuthRequestDto;
import br.hackathon.com.example.almoxarifado_compartilhado.security.dto.response.UserLoginAuthResponseDto;
import br.hackathon.com.example.almoxarifado_compartilhado.users.entity.UserEntity;
import br.hackathon.com.example.almoxarifado_compartilhado.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public UserLoginAuthResponseDto login(UserLoginAuthRequestDto dto) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        dto.email(),
                        dto.password()
                )
        );

        UserEntity user = userRepository.findByEmail(dto.email())
                .orElseThrow(() -> new RuntimeException("Usuario n?o encontrado"));

        String token = jwtService.generateToken(user);

        return new UserLoginAuthResponseDto(
                user.getNome(),
                user.getEmail(),
                token
        );
    }
}
