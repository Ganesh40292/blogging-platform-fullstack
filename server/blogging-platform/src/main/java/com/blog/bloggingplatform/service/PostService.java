package com.blog.bloggingplatform.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.blog.bloggingplatform.model.Post;
import com.blog.bloggingplatform.model.User;
import com.blog.bloggingplatform.repository.PostRepository;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private com.blog.bloggingplatform.repository.PostLikeRepository postLikeRepository;

    // CREATE
    public Post createPost(Post post, User user) {
        post.setUser(user);
        return postRepository.save(post);
    }

    // TOGGLE LIKE
    public Post toggleLike(Long postId, User user) {
        Post post = getPostById(postId);
        java.util.Optional<com.blog.bloggingplatform.model.PostLike> existingLike =
                postLikeRepository.findByPostIdAndUserId(postId, user.getId());

        if (existingLike.isPresent()) {
            postLikeRepository.delete(existingLike.get());
        } else {
            com.blog.bloggingplatform.model.PostLike newLike = new com.blog.bloggingplatform.model.PostLike();
            newLike.setPost(post);
            newLike.setUser(user);
            postLikeRepository.save(newLike);
        }
        return getPostById(postId);
    }

    // GET ALL
    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    // GET BY ID
    public Post getPostById(Long id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
    }

    // UPDATE
    public Post updatePost(Long id, Post updatedPost, User user) {

        if (user == null) throw new RuntimeException("Unauthorized");

        Post existing = getPostById(id);

        if (!existing.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Not allowed");
        }

        existing.setTitle(updatedPost.getTitle());
        existing.setContent(updatedPost.getContent());
        existing.setCategory(updatedPost.getCategory());
        existing.setTags(updatedPost.getTags());
        existing.setImageUrl(updatedPost.getImageUrl());

        return postRepository.save(existing);
    }

    // SEARCH & PAGINATED
    public org.springframework.data.domain.Page<Post> searchPosts(String search, String category, Long authorId, org.springframework.data.domain.Pageable pageable) {
        return postRepository.searchPosts(search, category, authorId, pageable);
    }

    // DELETE
    public void deletePost(Long id, User user) {

        if (user == null) throw new RuntimeException("Unauthorized");

        Post post = getPostById(id);

        if (!post.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Not allowed");
        }

        postRepository.delete(post);
    }
}