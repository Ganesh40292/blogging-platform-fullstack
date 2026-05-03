# 🔗 API Documentation

This document describes all backend API endpoints for the **Blogging Platform Full Stack Application**.

---

## 🌐 Base URL

```bash
http://localhost:8080/api
```

---

# 🔐 Authentication APIs

## 📌 Register User

**Endpoint**

```bash
POST /auth/register
```

**Request Body**

```json
{
  "name": "Ganesh",
  "email": "ganesh@gmail.com",
  "password": "123456"
}
```

**Response**

```json
{
  "id": 1,
  "name": "Ganesh",
  "email": "ganesh@gmail.com"
}
```

---

## 📌 Login User

**Endpoint**

```bash
POST /auth/login
```

**Request Body**

```json
{
  "email": "ganesh@gmail.com",
  "password": "123456"
}
```

**Response**

```json
{
  "token": "JWT_TOKEN_HERE",
  "user": {
    "id": 1,
    "name": "Ganesh",
    "email": "ganesh@gmail.com"
  }
}
```

---

# 📝 Post APIs

## 📌 Get All Posts

**Endpoint**

```bash
GET /posts
```

**Response**

```json
[
  {
    "id": 1,
    "title": "My First Blog",
    "content": "This is my first post",
    "createdAt": "2026-04-27T10:00:00",
    "user": {
      "id": 1,
      "name": "Ganesh"
    }
  }
]
```

---

## 📌 Get Post by ID

**Endpoint**

```bash
GET /posts/{id}
```

**Example**

```bash
GET /posts/1
```

---

## 📌 Create Post 🔐

**Endpoint**

```bash
POST /posts
```

**Headers**

```bash
Authorization: Bearer <JWT_TOKEN>
```

**Request Body**

```json
{
  "title": "New Blog",
  "content": "This is my content"
}
```

---

## 📌 Update Post 🔐

**Endpoint**

```bash
PUT /posts/{id}
```

**Headers**

```bash
Authorization: Bearer <JWT_TOKEN>
```

**Request Body**

```json
{
  "title": "Updated Title",
  "content": "Updated Content"
}
```

---

## 📌 Delete Post 🔐

**Endpoint**

```bash
DELETE /posts/{id}
```

**Headers**

```bash
Authorization: Bearer <JWT_TOKEN>
```

---

# 💬 Comment APIs *(Optional Feature)*

## 📌 Get Comments by Post

**Endpoint**

```bash
GET /comments/post/{postId}
```

---

## 📌 Add Comment 🔐

**Endpoint**

```bash
POST /comments
```

**Headers**

```bash
Authorization: Bearer <JWT_TOKEN>
```

**Request Body**

```json
{
  "content": "Nice post!",
  "post": {
    "id": 1
  }
}
```

---

## 📌 Update Comment 🔐

**Endpoint**

```bash
PUT /comments/{id}
```

---

## 📌 Delete Comment 🔐

**Endpoint**

```bash
DELETE /comments/{id}
```

---

# ⚠️ Error Handling

| Status Code | Meaning                              |
| ----------- | ------------------------------------ |
| 200         | Success                              |
| 400         | Bad Request                          |
| 401         | Unauthorized (Invalid login / token) |
| 403         | Forbidden (Access denied)            |
| 404         | Not Found                            |
| 500         | Server Error                         |

---

# 🔐 Authentication Notes

* All protected APIs require a JWT token
* Token must be sent in request header:

```bash
Authorization: Bearer <your_token>
```

* Token is received after successful login

---

# 📌 Important Notes

* Only the owner of a post/comment can update or delete it
* Passwords are securely stored using BCrypt
* Comments feature may be disabled in deployment (optional)

---
