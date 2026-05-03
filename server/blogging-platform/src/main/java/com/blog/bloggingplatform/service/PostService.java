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

    // CREATE
    public Post createPost(Post post, User user) {
        post.setUser(user);
        return postRepository.save(post);
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

        return postRepository.save(existing);
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