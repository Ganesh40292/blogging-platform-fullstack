import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

function Navbar() {
  const { user, logout } = useAuth();

  const linkClass = ({ isActive }) =>
    isActive ? "nav-item active" : "nav-item";

  return (
    <motion.nav 
      className="navbar"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <NavLink to="/" className="logo">
        <motion.span
          whileHover={{ scale: 1.1, color: "#6c5ce7" }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          BlogApp
        </motion.span>
      </NavLink>

      <div className="nav-right">
        <NavLink to="/" className={linkClass}>
          <motion.span whileHover={{ y: -2 }} whileTap={{ y: 0 }}>Home</motion.span>
        </NavLink>

        <NavLink to="/create" className={linkClass}>
          <motion.span whileHover={{ y: -2 }} whileTap={{ y: 0 }}>Create</motion.span>
        </NavLink>

        {!user ? (
          <>
            <NavLink to="/login" className={linkClass}>
              <motion.span whileHover={{ y: -2 }} whileTap={{ y: 0 }}>Login</motion.span>
            </NavLink>

            <NavLink to="/register" className="nav-item primary-btn">
              <motion.span whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                Register
              </motion.span>
            </NavLink>
          </>
        ) : (
          <>
            <Link to="/profile" className="nav-item user-pill">
              <span role="img" aria-label="user">🔥</span> {user.name}
            </Link>

            <motion.button 
              className="danger" 
              onClick={logout}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Logout
            </motion.button>
          </>
        )}
      </div>
    </motion.nav>
  );
}

export default Navbar;