package com.blog.bloggingplatform.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter;

    // ============================================
    // 🔐 MAIN SECURITY CONFIGURATION
    // ============================================
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            // 🌐 Enable CORS
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))

            // ❌ Disable CSRF (not required for JWT APIs)
            .csrf(csrf -> csrf.disable())

            // 🔒 Stateless session
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )

            // 🔑 Authorization rules
            .authorizeHttpRequests(auth -> auth

                // =========================
                // 🔓 PUBLIC ENDPOINTS
                // =========================
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/posts/**").permitAll()

                // Comments (GET allowed)
                .requestMatchers(HttpMethod.GET, "/api/comments/**").permitAll()

                // =========================
                // 🔒 PROTECTED ENDPOINTS
                // =========================
                .requestMatchers(HttpMethod.POST, "/api/comments").authenticated()
                .requestMatchers(HttpMethod.PUT, "/api/comments/**").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/api/comments/**").authenticated()

                // Everything else secured
                .anyRequest().authenticated()
            )

            // 🔐 Add JWT filter
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // ============================================
    // 🔐 PASSWORD ENCODER
    // ============================================
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // ============================================
    // 🌐 CORS CONFIGURATION (DEPLOYMENT READY)
    // ============================================
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration config = new CorsConfiguration();

        // 🔥 IMPORTANT: Allow all origins for deployment
        config.setAllowedOriginPatterns(List.of("*"));

        config.setAllowedMethods(
                List.of("GET", "POST", "PUT", "DELETE", "OPTIONS")
        );

        config.setAllowedHeaders(List.of("*"));

        // JWT → no cookies needed
        config.setAllowCredentials(false);

        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", config);

        return source;
    }
}