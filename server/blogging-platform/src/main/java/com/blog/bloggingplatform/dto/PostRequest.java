package com.blog.bloggingplatform.dto;

import lombok.Data;

@Data
public class PostRequest {
    private String title;
    private String content;
    private Long userId;   // which user is creating post
}