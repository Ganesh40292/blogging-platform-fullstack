# ⚙️ Project Setup Guide

This guide explains how to run the **Blogging Platform Full Stack Application** on your local machine.

---

## 📌 Prerequisites

Make sure the following are installed:

* Node.js (v18+)
* Java (JDK 17 or above)
* Maven
* MySQL
* Git

---

# 🚀 1️⃣ Clone the Repository

```bash id="1y0q6c"
git clone https://github.com/your-username/blogging-platform-fullstack.git
cd blogging-platform-fullstack
```

---

# 🗄️ 2️⃣ Database Setup (MySQL)

### Step 1: Open MySQL Workbench

### Step 2: Create Database

```sql id="kkh9a7"
CREATE DATABASE blog_db;
USE blog_db;
```

### Step 3: Create Tables

Run the SQL file:

```bash id="c4v7fz"
database/schema.sql
```

---

# ⚙️ 3️⃣ Backend Setup (Spring Boot)

### Step 1: Navigate to server folder

```bash id="2qv8jh"
cd server
```

---

### Step 2: Configure Database

Edit `application.properties`:

```properties id="6t1pfi"
spring.datasource.url=jdbc:mysql://localhost:3306/blog_db
spring.datasource.username=root
spring.datasource.password=your_password

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

---

### Step 3: Run Backend

```bash id="9cf77f"
mvn spring-boot:run
```

👉 Backend runs on:

```bash id="7y7k1o"
http://localhost:8080
```

---

# 🎨 4️⃣ Frontend Setup (React)

### Step 1: Navigate to client folder

```bash id="s51hpx"
cd client
```

---

### Step 2: Install Dependencies

```bash id="1o9u0h"
npm install
```

---

### Step 3: Start Frontend

```bash id="3l2g6m"
npm run dev
```

👉 Frontend runs on:

```bash id="g8r9y2"
http://localhost:5173
```

---

# 🔗 5️⃣ Connect Frontend to Backend

Make sure your `api.js` has:

```javascript id="u3k8hj"
baseURL: "http://localhost:8080/api"
```

---

# 🔐 6️⃣ Authentication Flow

1. Register a new user
2. Login to get JWT token
3. Token is stored in browser (localStorage)
4. Token is sent in API requests automatically

---

# ✅ 7️⃣ Verify Setup

After running everything:

* Open browser → http://localhost:5173
* Register a user
* Login
* Create a post
* View posts

---

# ⚠️ Common Issues & Fixes

### ❌ Backend not connecting to DB

* Check MySQL is running
* Verify username/password

---

### ❌ Port already in use

* Change port in `application.properties`:

```properties id="1x7waf"
server.port=8081
```

---

### ❌ CORS Error

Make sure backend allows frontend:

```java id="0q3o7w"
config.setAllowedOriginPatterns(List.of("*"));
```

---

### ❌ JWT / Unauthorized Error

* Login again
* Clear browser storage:

```javascript id="u9k7la"
localStorage.clear()
```

---

# 🎯 Final Result

If everything is correct:

* ✅ Frontend running
* ✅ Backend running
* ✅ Database connected
* ✅ Full app working

---

# 📌 Note

This setup is for local development.
For deployment, refer to **DEPLOYMENT.md**.

---
