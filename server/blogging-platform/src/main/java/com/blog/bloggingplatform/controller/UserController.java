package com.blog.bloggingplatform.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.blog.bloggingplatform.model.User;
import com.blog.bloggingplatform.repository.UserRepository;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/{id}/follow")
    public ResponseEntity<?> toggleFollowUser(@PathVariable Long id) {
        try {
            User currentUser = (User) SecurityContextHolder
                    .getContext()
                    .getAuthentication()
                    .getPrincipal();

            User dbCurrentUser = userRepository.findById(currentUser.getId())
                    .orElseThrow(() -> new RuntimeException("Current user not found"));
            User dbTargetUser = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("User to follow not found"));

            if (dbCurrentUser.getId().equals(dbTargetUser.getId())) {
                return ResponseEntity.badRequest().body("You cannot follow yourself");
            }

            boolean isFollowing = dbCurrentUser.getFollowing().stream()
                    .anyMatch(u -> u.getId().equals(dbTargetUser.getId()));

            if (isFollowing) {
                dbCurrentUser.getFollowing().removeIf(u -> u.getId().equals(dbTargetUser.getId()));
            } else {
                dbCurrentUser.getFollowing().add(dbTargetUser);
            }

            userRepository.save(dbCurrentUser);

            // Re-fetch to load correct relationships
            User updatedTarget = userRepository.findById(id).orElse(dbTargetUser);
            User updatedCurrent = userRepository.findById(currentUser.getId()).orElse(dbCurrentUser);

            java.util.Map<String, Object> stats = new java.util.HashMap<>();
            stats.put("followersCount", updatedTarget.getFollowers().size());
            stats.put("followingCount", updatedTarget.getFollowing().size());
            stats.put("isFollowing", !isFollowing);

            return ResponseEntity.ok(stats);

        } catch (Exception e) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
    }

    @GetMapping("/{id}/stats")
    public ResponseEntity<?> getUserStats(@PathVariable Long id) {
        try {
            User user = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            java.util.Map<String, Object> stats = new java.util.HashMap<>();
            stats.put("followersCount", user.getFollowers().size());
            stats.put("followingCount", user.getFollowing().size());

            try {
                User currentUser = (User) SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getPrincipal();
                User dbCurrentUser = userRepository.findById(currentUser.getId()).orElse(null);
                if (dbCurrentUser != null) {
                    boolean isFollowing = dbCurrentUser.getFollowing().stream()
                            .anyMatch(u -> u.getId().equals(user.getId()));
                    stats.put("isFollowing", isFollowing);
                } else {
                    stats.put("isFollowing", false);
                }
            } catch (Exception ex) {
                stats.put("isFollowing", false);
            }

            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(404).body("User not found");
        }
    }
}
