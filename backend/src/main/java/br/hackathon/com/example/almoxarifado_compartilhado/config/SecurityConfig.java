package br.hackathon.com.example.almoxarifado_compartilhado.config;

import br.hackathon.com.example.almoxarifado_compartilhado.security.service.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

   @Bean
    public SecurityFilterChain defaultSecurityFilterChain(HttpSecurity http) throws Exception {
       return http
               .csrf(AbstractHttpConfigurer:: disable)
               .authorizeHttpRequests(auth -> auth
                       .requestMatchers("/h2-console/**").permitAll()
                       .requestMatchers("/api/**", "/swagger-ui/**", "/v3/api-docs/**").permitAll()
                       .requestMatchers(HttpMethod.POST, "/v1/**").permitAll()
                       .requestMatchers(HttpMethod.GET, "/v1/**").permitAll()
                       .requestMatchers(HttpMethod.PUT, "/v1/**").permitAll()
                       .requestMatchers(HttpMethod.PATCH, "/v1/**").permitAll()
               )
               .exceptionHandling(ex -> ex
                       .authenticationEntryPoint(authenticationEntryPoint())
                       .accessDeniedHandler(accessDeniedHandler()))
               .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
               .build();
   }

   @Bean
   public AuthenticationManager authenticationManagerBean(AuthenticationConfiguration config) throws Exception {
       return config.getAuthenticationManager();
   }

   @Bean
   public AuthenticationEntryPoint authenticationEntryPoint() {
       return (request, response, e) -> {
           response.setStatus(HttpStatus.UNAUTHORIZED.value());
           response.setContentType("application/json");
           response.getWriter().write("""
                   {
                    "status" : 401,
                    "error" : "Unauthorized",
                    "message" : "Usuario não tem permissão para acessar esse recurso"
                   }
                   """);
       };
   }
    @Bean
    public AccessDeniedHandler accessDeniedHandler() {
        return (request, response, accessDeniedException) -> {
            response.setStatus(HttpStatus.FORBIDDEN.value());
            response.setContentType("application/json");
            response.getWriter().write("""
                     {
                     "status" : 403,
                     "error" : "Forbidden",
                     "message" : "Usuario não tem permissão para acessar essa area"
                    }
                    """);
        };
    }
}
