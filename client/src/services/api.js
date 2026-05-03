import axios from "axios";

// ============================================
// 🌐 BASE URL CONFIG (ENV + FALLBACK)
// ============================================
const BASE_URL =
  import.meta.env.VITE_API_URL?.trim() ||
  "http://localhost:8080/api";

// ============================================
// 🌐 AXIOS INSTANCE
// ============================================
const API = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000, // Increased to 60s for Render cold-starts
});

// ============================================
// 🔐 REQUEST INTERCEPTOR (Attach JWT Token)
// ============================================
API.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem("token");

      if (
        token &&
        token !== "undefined" &&
        token !== "null" &&
        token.trim() !== ""
      ) {
        config.headers.Authorization = `Bearer ${token}`;
      }

    } catch (err) {
      console.error("Token read error:", err);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ============================================
// 🌍 RESPONSE INTERCEPTOR (GLOBAL ERROR HANDLER)
// ============================================
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error?.response || error.message);

    const status = error?.response?.status;

    // 🔐 Handle Unauthorized (ONLY 401)
    if (status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }

    // ⚠️ Handle Forbidden (DO NOT LOGOUT)
    if (status === 403) {
      console.warn("Forbidden request - Permission issue");
    }

    // 🔥 Normalize error message
    let message = "Something went wrong";

    if (error?.response?.data) {
      if (typeof error.response.data === "string") {
        message = error.response.data;
      } else if (error.response.data?.message) {
        message = error.response.data.message;
      }
    } else if (error?.message) {
      message = error.message;
    }

    return Promise.reject(message);
  }
);

// ============================================
// 🔁 GENERIC REQUEST HANDLER (KEEP RESPONSE)
// ============================================
const handleRequest = async (requestPromise) => {
  try {
    const response = await requestPromise;
    return response; // ✅ IMPORTANT: keep full response
  } catch (error) {
    throw error;
  }
};

// ============================================
// 📝 POSTS APIs
// ============================================
// 🔥 FIX: Removed leading slashes so they append to BASE_URL correctly
export const getPosts = () =>
  handleRequest(API.get("posts"));

export const getPostById = (id) =>
  handleRequest(API.get(`posts/${id}`));

export const createPost = (data) =>
  handleRequest(API.post("posts", data));

export const updatePost = (id, data) =>
  handleRequest(API.put(`posts/${id}`, data));

export const deletePost = (id) =>
  handleRequest(API.delete(`posts/${id}`));

// ============================================
// 💬 COMMENTS APIs
// ============================================
export const addComment = (data) =>
  handleRequest(API.post("comments", data));

export const getCommentsByPost = (postId) =>
  handleRequest(API.get(`comments/post/${postId}`));

export const updateComment = (id, data) =>
  handleRequest(API.put(`comments/${id}`, data));

export const deleteComment = (id) =>
  handleRequest(API.delete(`comments/${id}`));

// ============================================
// 🔐 AUTH APIs
// ============================================
export const registerUser = (data) =>
  handleRequest(API.post("auth/register", data));

export const loginUser = (data) =>
  handleRequest(API.post("auth/login", data));

// ============================================
// 📦 EXPORT INSTANCE
// ============================================
export default API;
