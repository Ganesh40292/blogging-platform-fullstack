package com.blog.bloggingplatform.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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

import com.blog.bloggingplatform.model.Comment;
import com.blog.bloggingplatform.model.User;
import com.blog.bloggingplatform.service.CommentService;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = "*")
public class CommentController {

    @Autowired
    private CommentService commentService;

    // ============================================
    // 🔐 GET LOGGED-IN USER (COMMON METHOD)
    // ============================================
    private User getLoggedInUser() {
        Object principal = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        if (principal instanceof User) {
            return (User) principal;
        }
        return null;
    }

    // ============================================
    // ✅ ADD COMMENT (DTO STYLE)
    // ============================================
    @PostMapping
    public ResponseEntity<?> addComment(@RequestBody Map<String, Object> body) {

        try {
            User user = getLoggedInUser();

            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Unauthorized: Please login");
            }

            String content = (String) body.get("content");
            Object postIdObj = body.get("postId");

            // 🔍 Validation
            if (content == null || content.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body("Comment content cannot be empty");
            }

            if (postIdObj == null) {
                return ResponseEntity.badRequest()
                        .body("Post ID is required");
            }

            Long postId;
            try {
                postId = Long.valueOf(postIdObj.toString());
            } catch (Exception e) {
                return ResponseEntity.badRequest()
                        .body("Invalid Post ID");
            }

            Comment savedComment = commentService.addCommentByPostId(
                    content.trim(),
                    postId,
                    user
            );

            return ResponseEntity.ok(savedComment);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error adding comment: " + e.getMessage());
        }
    }

    // ============================================
    // 📄 GET COMMENTS BY POST
    // ============================================
    @GetMapping("/post/{postId}")
    public ResponseEntity<?> getCommentsByPost(@PathVariable Long postId) {

        try {
            if (postId == null) {
                return ResponseEntity.badRequest()
                        .body("Post ID is required");
            }

            List<Comment> comments = commentService.getCommentsByPost(postId);

            return ResponseEntity.ok(comments);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching comments");
        }
    }

    // ============================================
    // 📄 GET ALL COMMENTS
    // ============================================
    @GetMapping
    public ResponseEntity<?> getAllComments() {

        try {
            return ResponseEntity.ok(commentService.getAllComments());

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching comments");
        }
    }

    // ============================================
    // ✏️ UPDATE COMMENT
    // ============================================
    @PutMapping("/{id}")
    public ResponseEntity<?> updateComment(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body) {

        try {
            User user = getLoggedInUser();

            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Unauthorized");
            }

            String content = (String) body.get("content");

            if (content == null || content.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body("Comment content cannot be empty");
            }

            Comment updatedComment = new Comment();
            updatedComment.setContent(content.trim());

            Comment result = commentService.updateComment(id, updatedComment, user);

            return ResponseEntity.ok(result);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating comment");
        }
    }

    // ============================================
    // 🗑️ DELETE COMMENT
    // ============================================
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteComment(@PathVariable Long id) {

        try {
            User user = getLoggedInUser();

            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Unauthorized");
            }

            commentService.deleteComment(id, user);

            return ResponseEntity.ok("Comment deleted successfully");

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting comment");
        }
    }
}