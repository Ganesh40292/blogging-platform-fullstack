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

        try {
            User user = (User) SecurityContextHolder
                    .getContext()
                    .getAuthentication()
                    .getPrincipal();

            return ResponseEntity.ok(postService.createPost(post, user));

        } catch (Exception e) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
    }

    // ============================================
    // ✅ GET ALL POSTS
    // ============================================
    @GetMapping
    public ResponseEntity<List<Post>> getAllPosts() {
        return ResponseEntity.ok(postService.getAllPosts());
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

        try {
            User user = (User) SecurityContextHolder
                    .getContext()
                    .getAuthentication()
                    .getPrincipal();

            return ResponseEntity.ok(postService.updatePost(id, post, user));

        } catch (Exception e) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
    }

    // ============================================
    // 🗑️ DELETE POST
    // ============================================
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(@PathVariable Long id) {

        try {
            User user = (User) SecurityContextHolder
                    .getContext()
                    .getAuthentication()
                    .getPrincipal();

            postService.deletePost(id, user);

            return ResponseEntity.ok("Post deleted successfully");

        } catch (Exception e) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
    }
}