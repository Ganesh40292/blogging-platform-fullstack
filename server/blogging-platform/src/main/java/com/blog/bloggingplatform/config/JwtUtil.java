package com.blog.bloggingplatform.config;

import java.security.Key;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

    // ============================================
    // 🔐 SECRET FROM ENV (WITH FALLBACK)
    // ============================================
    @Value("${jwt.secret:mysecretkeymysecretkeymysecretkey123}")
    private String secret;

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    // ============================================
    // ⏳ TOKEN EXPIRATION (1 DAY)
    // ============================================
    private static final long EXPIRATION_TIME =
            1000 * 60 * 60 * 24;

    // ============================================
    // 🔐 GENERATE TOKEN
    // ============================================
    public String generateToken(String email) {

        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + EXPIRATION_TIME);

        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(getSigningKey())
                .compact();
    }

    // ============================================
    // 📥 EXTRACT EMAIL
    // ============================================
    public String extractEmail(String token) {
        return extractAllClaims(token).getSubject();
    }

    // ============================================
    // 📦 EXTRACT CLAIMS
    // ============================================
    private Claims extractAllClaims(String token) {

        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // ============================================
    // ⏳ CHECK EXPIRATION
    // ============================================
    public boolean isTokenExpired(String token) {
        try {
            return extractAllClaims(token)
                    .getExpiration()
                    .before(new Date());
        } catch (Exception e) {
            return true;
        }
    }

    // ============================================
    // ✅ VALIDATE TOKEN
    // ============================================
    public boolean validateToken(String token, String email) {

        try {
            String extractedEmail = extractEmail(token);

            return extractedEmail != null
                    && extractedEmail.equals(email)
                    && !isTokenExpired(token);

        } catch (Exception e) {
            return false;
        }
    }

    // ============================================
    // 🧪 DEBUG (OPTIONAL)
    // ============================================
    public Date extractExpiration(String token) {
        return extractAllClaims(token).getExpiration();
    }
}