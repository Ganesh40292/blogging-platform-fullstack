package com.blog.bloggingplatform.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.blog.bloggingplatform.model.Comment;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    // Get all comments for a specific post
    List<Comment> findByPostId(Long postId);
}