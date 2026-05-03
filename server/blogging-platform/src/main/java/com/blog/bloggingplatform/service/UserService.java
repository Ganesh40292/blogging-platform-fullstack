package com.blog.bloggingplatform.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.blog.bloggingplatform.dto.LoginRequest;
import com.blog.bloggingplatform.dto.RegisterRequest;
import com.blog.bloggingplatform.model.User;
import com.blog.bloggingplatform.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // ==================================================
    // 📝 REGISTER USER
    // ==================================================
    public User registerUser(RegisterRequest request) {

        // ================= VALIDATION =================

        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw new RuntimeException("Name is required");
        }

        if (request.getEmail() == null ||
                !request.getEmail().matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new RuntimeException("Invalid email format");
        }

        if (request.getPassword() == null || request.getPassword().length() < 6) {
            throw new RuntimeException("Password must be at least 6 characters");
        }

        // Normalize email (🔥 IMPORTANT FIX)
        String email = request.getEmail().trim().toLowerCase();

        // ================= DUPLICATE CHECK =================
        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        // ================= PASSWORD HASHING =================
        String encodedPassword = passwordEncoder.encode(request.getPassword());

        // ================= CREATE USER =================
        User user = new User();
        user.setName(request.getName().trim());
        user.setEmail(email);
        user.setPassword(encodedPassword);

        return userRepository.save(user);
    }

    // ==================================================
    // 🔐 LOGIN USER
    // ==================================================
    public User loginUser(LoginRequest request) {

        if (request.getEmail() == null || request.getPassword() == null) {
            throw new RuntimeException("Email and password are required");
        }

        // Normalize email (🔥 IMPORTANT FIX)
        String email = request.getEmail().trim().toLowerCase();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        // ================= PASSWORD MATCH =================
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        return user;
    }
}