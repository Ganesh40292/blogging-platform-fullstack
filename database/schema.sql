-- ===============================
-- DATABASE
-- ===============================
CREATE DATABASE IF NOT EXISTS blog_db;
USE blog_db;

-- ===============================
-- USER TABLE
-- ===============================
CREATE TABLE user (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- ===============================
-- POST TABLE
-- ===============================
CREATE TABLE post (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    user_id BIGINT NOT NULL,
    CONSTRAINT fk_post_user
    FOREIGN KEY (user_id)
    REFERENCES user(id)
    ON DELETE CASCADE
);

-- ===============================
-- COMMENT TABLE
-- ===============================
CREATE TABLE comment (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    user_id BIGINT NOT NULL,
    post_id BIGINT NOT NULL,

    CONSTRAINT fk_comment_user
    FOREIGN KEY (user_id)
    REFERENCES user(id)
    ON DELETE CASCADE,

    CONSTRAINT fk_comment_post
    FOREIGN KEY (post_id)
    REFERENCES post(id)
    ON DELETE CASCADE
);

-- Insert user (password should be BCrypt in real app)
INSERT INTO user (name, email, password)
VALUES ('Ganesh', 'ganesh@gmail.com', '123456');

-- Insert post
INSERT INTO post (title, content, user_id)
VALUES 
(
  'Learning Spring Boot',
  'Spring Boot makes backend development easier.',
  1
);

-- Insert comment
INSERT INTO comment (content, user_id, post_id)
VALUES 
(
  'Nice post!',
  1,
  1
);