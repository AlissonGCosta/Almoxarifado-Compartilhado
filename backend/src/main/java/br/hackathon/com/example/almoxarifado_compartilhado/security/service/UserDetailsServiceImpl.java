package br.hackathon.com.example.almoxarifado_compartilhado.security.service;

import br.hackathon.com.example.almoxarifado_compartilhado.exception.RessourceNotFoundException;
import br.hackathon.com.example.almoxarifado_compartilhado.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        var user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RessourceNotFoundException("Usuario n?o encontrado"));

        return User.builder()
                .username(user.getEmail())
                .password(user.getSenha())
                .authorities(user.getRoles().name())
                .build();
    }
}
