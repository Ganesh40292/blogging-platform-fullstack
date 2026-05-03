import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";

import Navbar from "./components/Navbar";
import SplashScreen from "./components/SplashScreen";

import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PostDetails from "./pages/PostDetails";
import Profile from "./pages/Profile";

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    
    const checkScroll = () => {
      if (window.pageYOffset > 400) setShowScroll(true);
      else setShowScroll(false);
    };

    window.addEventListener('scroll', checkScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', checkScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence mode="wait">
      {showSplash ? (
        <SplashScreen key="splash" />
      ) : (
        <motion.div 
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Toaster position="top-right" />
          <Navbar />

          <main
            style={{
              padding: "30px",
              maxWidth: "1000px",
              margin: "auto",
              minHeight: "80vh"
            }}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/create" element={<CreatePost />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/post/:id" element={<PostDetails />} />
              <Route path="*" element={<h2>Page Not Found</h2>} />
            </Routes>
          </main>

          {/* ⬆️ Scroll to Top Button */}
          <AnimatePresence>
            {showScroll && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                onClick={scrollToTop}
                className="scroll-to-top"
                title="Back to Top"
              >
                ↑
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default App;