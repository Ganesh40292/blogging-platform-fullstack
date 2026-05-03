import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

import { FaEnvelope, FaLock, FaGithub, FaGoogle } from "react-icons/fa";
import { IoEye, IoEyeOff } from "react-icons/io5";

import authHero from "../assets/auth_hero.png";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const res = await loginUser({ email: email.trim(), password });
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      login(user);
      navigate("/");
    } catch (err) {
      setError(typeof err === "string" ? err : "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <motion.div 
        className="auth-container"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* 🖼️ Left Side: Visuals */}
        <div className="auth-visual">
          <img src={authHero} alt="Welcome" />
          <div className="visual-text">
            <h2>Welcome Back!</h2>
            <p>Your creative community is waiting for your next big idea.</p>
          </div>
        </div>

        {/* 📝 Right Side: Form */}
        <div className="auth-form-side">
          <div className="auth-header">
            <h1>Login</h1>
            <p>Don't have an account? <Link to="/register">Register here</Link></p>
          </div>

          {error && <p className="error-banner">{error}</p>}

          <form onSubmit={handleLogin} className="login-form">
            <div className="input-field">
              <FaEnvelope className="field-icon" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Email Address"
              />
            </div>

            <div className="input-field">
              <FaLock className="field-icon" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Password"
              />
              <button
                type="button"
                className="toggle-pass"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <IoEyeOff /> : <IoEye />}
              </button>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="primary auth-btn"
              type="submit"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login to Account"}
            </motion.button>

            <div className="divider">
              <span>OR</span>
            </div>

            <div className="social-auth">
              <button type="button" className="social-btn"><FaGoogle /> Google</button>
              <button type="button" className="social-btn"><FaGithub /> GitHub</button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;