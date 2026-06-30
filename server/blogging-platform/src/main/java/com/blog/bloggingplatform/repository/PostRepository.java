package com.blog.bloggingplatform.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.blog.bloggingplatform.model.Post;

public interface PostRepository extends JpaRepository<Post, Long> {

    @Query("SELECT p FROM Post p WHERE " +
           "(:search IS NULL OR :search = '' OR LOWER(p.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(p.content) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:category IS NULL OR :category = '' OR LOWER(p.category) = LOWER(:category)) AND " +
           "(:authorId IS NULL OR p.user.id = :authorId)")
    Page<Post> searchPosts(
        @Param("search") String search,
        @Param("category") String category,
        @Param("authorId") Long authorId,
        Pageable pageable
    );
}