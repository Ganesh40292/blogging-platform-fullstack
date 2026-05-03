import { motion } from "framer-motion";

function SplashScreen() {
  return (
    <motion.div 
      className="splash-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <motion.div 
        className="splash-content"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          duration: 0.8, 
          ease: "easeOut",
          staggerChildren: 0.2
        }}
      >
        <motion.div 
          className="splash-logo"
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          🚀
        </motion.div>
        
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          BlogApp
        </motion.h1>
        
        <motion.div 
          className="splash-loader"
          initial={{ width: 0 }}
          animate={{ width: "200px" }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 1 }}
        >
          Igniting your creativity...
        </motion.p>
      </motion.div>
    </motion.div>
  );
}

export default SplashScreen;
