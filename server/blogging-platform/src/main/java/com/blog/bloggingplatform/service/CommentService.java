package com.blog.bloggingplatform.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.blog.bloggingplatform.model.Comment;
import com.blog.bloggingplatform.model.Post;
import com.blog.bloggingplatform.model.User;
import com.blog.bloggingplatform.repository.CommentRepository;
import com.blog.bloggingplatform.repository.PostRepository;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private PostRepository postRepository;

    // ============================================
    // ✅ ADD COMMENT USING postId (FIXED)
    // ============================================
    public Comment addCommentByPostId(String content, Long postId, User user) {

        if (user == null) {
            throw new RuntimeException("User not authenticated");
        }

        if (content == null || content.trim().isEmpty()) {
            throw new RuntimeException("Comment content cannot be empty");
        }

        if (postId == null) {
            throw new RuntimeException("Post ID is required");
        }

        // 🔍 Fetch post safely
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        // 🆕 Create new comment
        Comment comment = new Comment();
        comment.setContent(content.trim());
        comment.setUser(user);
        comment.setPost(post);

        return commentRepository.save(comment);
    }

    // ============================================
    // ✏️ UPDATE COMMENT
    // ============================================
    public Comment updateComment(Long id, Comment updated, User user) {

        if (user == null) {
            throw new RuntimeException("User not authenticated");
        }

        Comment existing = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        // 🔒 Ownership check
        if (!existing.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized to update this comment");
        }

        if (updated.getContent() == null || updated.getContent().trim().isEmpty()) {
            throw new RuntimeException("Comment content cannot be empty");
        }

        existing.setContent(updated.getContent().trim());

        return commentRepository.save(existing);
    }

    // ============================================
    // 🗑️ DELETE COMMENT
    // ============================================
    public void deleteComment(Long id, User user) {

        if (user == null) {
            throw new RuntimeException("User not authenticated");
        }

        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        // 🔒 Ownership check
        if (!comment.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized to delete this comment");
        }

        commentRepository.delete(comment);
    }

    // ============================================
    // 📄 GET ALL COMMENTS
    // ============================================
    public List<Comment> getAllComments() {
        return commentRepository.findAll();
    }

    // ============================================
    // 📄 GET COMMENTS BY POST
    // ============================================
    public List<Comment> getCommentsByPost(Long postId) {

        if (postId == null) {
            throw new RuntimeException("Post ID is required");
        }

        return commentRepository.findByPostId(postId);
    }
}