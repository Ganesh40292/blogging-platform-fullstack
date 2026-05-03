package com.blog.bloggingplatform.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.blog.bloggingplatform.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // ============================================
    // 🔍 FIND USER BY EMAIL (FOR LOGIN / JWT)
    // ============================================
    Optional<User> findByEmail(String email);

    // ============================================
    // 🔍 CHECK IF EMAIL EXISTS (FOR REGISTER VALIDATION)
    // ============================================
    boolean existsByEmail(String email);
}