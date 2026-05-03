package com.blog.bloggingplatform.dto;

import lombok.Data;

@Data
public class CommentRequest {
    private String content;
    private Long userId;
    private Long postId;
}