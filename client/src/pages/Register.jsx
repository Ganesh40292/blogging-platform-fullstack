import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/api";
import { motion } from "framer-motion";

import { FaUser, FaEnvelope, FaLock, FaGithub, FaGoogle } from "react-icons/fa";
import { IoEye, IoEyeOff } from "react-icons/io5";

import authHero from "../assets/auth_hero.png";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await registerUser({ name: name.trim(), email: email.trim(), password });
      navigate("/login");
    } catch (err) {
      setError(typeof err === "string" ? err : "Registration failed");
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
          <img src={authHero} alt="Join Us" />
          <div className="visual-text">
            <h2>Start Your Journey</h2>
            <p>Join thousands of writers and share your voice with the world.</p>
          </div>
        </div>

        {/* 📝 Right Side: Form */}
        <div className="auth-form-side">
          <div className="auth-header">
            <h1>Create Account</h1>
            <p>Already have an account? <Link to="/login">Login here</Link></p>
          </div>

          {error && <p className="error-banner">{error}</p>}

          <form onSubmit={handleRegister} className="login-form">
            <div className="input-field">
              <FaUser className="field-icon" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Full Name"
              />
            </div>

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

            <div className="input-field">
              <FaLock className="field-icon" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm Password"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="primary auth-btn"
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
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

export default Register;