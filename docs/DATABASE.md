# 🗄️ Database Documentation

This document describes the database design used in the **Blogging Platform Full Stack Application**.

---

## 📌 Database Name

```sql
blog_db
```

---

# 🧠 Overview

The database consists of **3 main tables**:

* `user` → Stores user information
* `post` → Stores blog posts
* `comment` → Stores comments on posts

---

# 📊 Entity Relationship Diagram (ER Diagram)

```id="h5v9lq"
USER (1) ──────── (M) POST (1) ──────── (M) COMMENT
   │                  │                     │
   │                  │                     │
   └───────────────┐  └───────────────┐     │
                   │                  │     │
              user_id             user_id   post_id
```

### 🧾 Explanation

* One **user** can create many **posts**
* One **post** can have many **comments**
* Each **comment** belongs to:

  * one user
  * one post

---

# 📋 Table Structure

---

## 👤 USER Table

```sql
CREATE TABLE user (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);
```

### 🔑 Fields

| Column   | Type    | Description                 |
| -------- | ------- | --------------------------- |
| id       | BIGINT  | Primary Key                 |
| name     | VARCHAR | User name                   |
| email    | VARCHAR | Unique email address        |
| password | VARCHAR | Encrypted password (BCrypt) |

---

## 📝 POST Table

```sql
CREATE TABLE post (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    user_id BIGINT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id)
    ON DELETE CASCADE
);
```

### 🔑 Fields

| Column     | Type     | Description            |
| ---------- | -------- | ---------------------- |
| id         | BIGINT   | Primary Key            |
| title      | VARCHAR  | Post title             |
| content    | TEXT     | Post content           |
| created_at | DATETIME | Creation timestamp     |
| user_id    | BIGINT   | Foreign Key → user(id) |

---

## 💬 COMMENT Table

```sql
CREATE TABLE comment (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    user_id BIGINT NOT NULL,
    post_id BIGINT NOT NULL,

    FOREIGN KEY (user_id) REFERENCES user(id)
    ON DELETE CASCADE,

    FOREIGN KEY (post_id) REFERENCES post(id)
    ON DELETE CASCADE
);
```

### 🔑 Fields

| Column     | Type     | Description            |
| ---------- | -------- | ---------------------- |
| id         | BIGINT   | Primary Key            |
| content    | TEXT     | Comment text           |
| created_at | DATETIME | Timestamp              |
| user_id    | BIGINT   | Foreign Key → user(id) |
| post_id    | BIGINT   | Foreign Key → post(id) |

---

# 🔗 Relationships Summary

| Relationship   | Type | Description                      |
| -------------- | ---- | -------------------------------- |
| User → Post    | 1:M  | One user can create many posts   |
| Post → Comment | 1:M  | One post can have many comments  |
| User → Comment | 1:M  | One user can write many comments |

---

# 🔐 Constraints Used

* **PRIMARY KEY** → Ensures unique records
* **FOREIGN KEY** → Maintains relationships
* **ON DELETE CASCADE** → Automatically deletes related data

---

# ⚠️ Important Notes

* Email must be unique for each user
* Passwords are stored in encrypted format (BCrypt)
* Deleting a user will delete:

  * their posts
  * their comments
* Deleting a post will delete:

  * all related comments

---

# 🚀 Example Data Flow

```id="7z8q7p"
User registers → stored in user table
       ↓
User creates post → stored in post table (user_id linked)
       ↓
User adds comment → stored in comment table (linked to post & user)
```

---

# 📌 Conclusion

This database design ensures:

* Data consistency
* Strong relationships
* Secure storage
* Scalable structure for future features

---
