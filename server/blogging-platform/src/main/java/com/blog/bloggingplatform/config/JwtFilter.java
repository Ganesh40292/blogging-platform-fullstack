package com.blog.bloggingplatform.config;

import java.io.IOException;
import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.blog.bloggingplatform.model.User;
import com.blog.bloggingplatform.repository.UserRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        try {
            // 🔍 Get Authorization header
            String authHeader = request.getHeader("Authorization");

            // ✅ Check Bearer token
            if (authHeader != null && authHeader.startsWith("Bearer ")) {

                String token = authHeader.substring(7).trim();

                // 🔍 Extract email from token
                String email = jwtUtil.extractEmail(token);

                // ✅ Validate token
                if (email != null && !jwtUtil.isTokenExpired(token)) {

                    User user = userRepository.findByEmail(email).orElse(null);

                    if (user != null && jwtUtil.validateToken(token, email)) {

                        // 🔐 Set authentication in security context
                        UsernamePasswordAuthenticationToken authentication =
                                new UsernamePasswordAuthenticationToken(
                                        user,
                                        null,
                                        Collections.emptyList()
                                );

                        SecurityContext context = SecurityContextHolder.createEmptyContext();
                        context.setAuthentication(authentication);
                        SecurityContextHolder.setContext(context);

                        // Optional (if controllers still use it)
                        request.setAttribute("user", user);
                    }
                }
            }

        } catch (Exception e) {
            // ❌ Never break request flow
            System.err.println("JWT Filter Error: " + e.getMessage());
        }

        // 🔄 Continue filter chain
        filterChain.doFilter(request, response);
    }
}