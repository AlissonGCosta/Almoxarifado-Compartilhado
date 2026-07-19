package br.hackathon.com.example.almoxarifado_compartilhado.security.service;

import br.hackathon.com.example.almoxarifado_compartilhado.exception.RessourceNotFoundException;
import br.hackathon.com.example.almoxarifado_compartilhado.users.entity.UserEntity;
import br.hackathon.com.example.almoxarifado_compartilhado.users.repository.UserRepository;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;


    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        if(authHeader == null || !authHeader.startsWith("Bearer ")){
            filterChain.doFilter(request, response);
            return;
        }

        final String jwtToken = authHeader.substring(7);
        final String email;

        try{
            email = jwtService.extractEmail(jwtToken);

        }catch(ExpiredJwtException ex){
           response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
           response.setContentType("application/json");
           response.getWriter().write("""
                {
                  "status": 401,
                  "error": "Unauthorized",
                  "message": "Token expired"
                }
                """
           );
           return;
        }

        if(email != null && SecurityContextHolder.getContext().getAuthentication() == null){
            UserEntity user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RessourceNotFoundException("usuario não encontrado"));

            if(jwtService.isTokenValid(jwtToken, user)){
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        user.getEmail(),
                        null,
                        List.of(new SimpleGrantedAuthority(user.getRoles().name()))
                );

                authentication.setDetails(new WebAuthenticationDetailsSource()
                        .buildDetails(request)
                );
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        filterChain.doFilter(request, response);
    }
}
