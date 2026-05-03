package com.blog.bloggingplatform.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.blog.bloggingplatform.config.JwtUtil;
import com.blog.bloggingplatform.dto.LoginRequest;
import com.blog.bloggingplatform.dto.RegisterRequest;
import com.blog.bloggingplatform.model.User;
import com.blog.bloggingplatform.service.UserService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    // ================= REGISTER =================
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            User user = userService.registerUser(request);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ================= LOGIN =================
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            User user = userService.loginUser(request);

            String token = jwtUtil.generateToken(user.getEmail());

            return ResponseEntity.ok(
                Map.of(
                    "token", token,
                    "user", user
                )
            );

        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }
}