package com.blog.bloggingplatform.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.blog.bloggingplatform.model.Post;
import com.blog.bloggingplatform.model.User;
import com.blog.bloggingplatform.service.PostService;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "*")
public class PostController {

    @Autowired
    private PostService postService;

    // ============================================
    // ✅ CREATE POST
    // ============================================
    @PostMapping
    public ResponseEntity<?> createPost(@RequestBody Post post) {
        User user;
        try {
            user = (User) SecurityContextHolder
                    .getContext()
                    .getAuthentication()
                    .getPrincipal();
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Unauthorized: Please log in");
        }

        try {
            return ResponseEntity.ok(postService.createPost(post, user));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error creating post: " + e.getMessage());
        }
    }

    // ============================================
    // ✅ GET ALL POSTS
    // ============================================
    @GetMapping
    public ResponseEntity<?> getAllPosts(
            @org.springframework.web.bind.annotation.RequestParam(required = false) String search,
            @org.springframework.web.bind.annotation.RequestParam(required = false) String category,
            @org.springframework.web.bind.annotation.RequestParam(required = false) Long authorId,
            @org.springframework.web.bind.annotation.RequestParam(defaultValue = "0") int page,
            @org.springframework.web.bind.annotation.RequestParam(defaultValue = "10") int size,
            @org.springframework.web.bind.annotation.RequestParam(defaultValue = "createdAt") String sortBy,
            @org.springframework.web.bind.annotation.RequestParam(defaultValue = "desc") String direction) {

        org.springframework.data.domain.Sort sort = direction.equalsIgnoreCase("desc")
                ? org.springframework.data.domain.Sort.by(sortBy).descending()
                : org.springframework.data.domain.Sort.by(sortBy).ascending();

        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size, sort);
        return ResponseEntity.ok(postService.searchPosts(search, category, authorId, pageable));
    }

    // ============================================
    // ✅ LIKE/UNLIKE POST
    // ============================================
    @PostMapping("/{id}/like")
    public ResponseEntity<?> toggleLike(@PathVariable Long id) {
        User user;
        try {
            user = (User) SecurityContextHolder
                    .getContext()
                    .getAuthentication()
                    .getPrincipal();
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Unauthorized: Please log in");
        }

        try {
            return ResponseEntity.ok(postService.toggleLike(id, user));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error toggling like: " + e.getMessage());
        }
    }

    // ============================================
    // ✅ GET POST BY ID
    // ============================================
    @GetMapping("/{id}")
    public ResponseEntity<?> getPost(@PathVariable Long id) {
        return ResponseEntity.ok(postService.getPostById(id));
    }

    // ============================================
    // ✏️ UPDATE POST
    // ============================================
    @PutMapping("/{id}")
    public ResponseEntity<?> updatePost(@PathVariable Long id,
                                        @RequestBody Post post) {
        User user;
        try {
            user = (User) SecurityContextHolder
                    .getContext()
                    .getAuthentication()
                    .getPrincipal();
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Unauthorized: Please log in");
        }

        try {
            return ResponseEntity.ok(postService.updatePost(id, post, user));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating post: " + e.getMessage());
        }
    }

    // ============================================
    // 🗑️ DELETE POST
    // ============================================
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(@PathVariable Long id) {
        User user;
        try {
            user = (User) SecurityContextHolder
                    .getContext()
                    .getAuthentication()
                    .getPrincipal();
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Unauthorized: Please log in");
        }

        try {
            postService.deletePost(id, user);
            return ResponseEntity.ok("Post deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error deleting post: " + e.getMessage());
        }
    }
}