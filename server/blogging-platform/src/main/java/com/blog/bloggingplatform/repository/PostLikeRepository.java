package com.blog.bloggingplatform.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.blog.bloggingplatform.model.PostLike;

@Repository
public interface PostLikeRepository extends JpaRepository<PostLike, Long> {
    boolean existsByPostIdAndUserId(Long postId, Long userId);
    Optional<PostLike> findByPostIdAndUserId(Long postId, Long userId);
}
