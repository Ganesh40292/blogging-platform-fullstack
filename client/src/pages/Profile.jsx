import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getPosts, getUserFollowStats } from "../services/api";
import PostCard from "../components/PostCard";
import { motion } from "framer-motion";
import { FaUserCircle, FaEnvelope, FaCalendarAlt, FaPenNib, FaUserPlus, FaUserCheck } from "react-icons/fa";

function Profile() {
  const { user } = useAuth();
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followStats, setFollowStats] = useState({ followersCount: 0, followingCount: 0 });

  // 🔄 Define fetch function so it can be passed as a refresh prop
  const fetchUserPosts = async () => {
    try {
      setLoading(true);
      const res = await getPosts({ authorId: user.id }); // Fetch posts by authorId efficiently from backend
      const data = res.data?.content || (Array.isArray(res.data) ? res.data : []);
      setUserPosts(data);
    } catch (err) {
      console.error("Error fetching user posts:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFollowStats = async () => {
    if (!user) return;
    try {
      const statsRes = await getUserFollowStats(user.id);
      setFollowStats(statsRes.data);
    } catch (err) {
      console.error("Error fetching user follow stats:", err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserPosts();
      fetchFollowStats();
    }
  }, [user]);

  if (!user) return <div className="container"><p>Please login to view your profile.</p></div>;

  return (
    <div className="container">
      {/* 👤 Profile Header Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card profile-header"
      >
        <div className="profile-info">
          <div className="profile-avatar">
            <FaUserCircle size={80} color="#a29bfe" />
          </div>
          <div className="profile-details">
            <h1>{user.name}</h1>
            <p><FaEnvelope /> {user.email}</p>
            <p><FaCalendarAlt /> Member since 2024</p>
          </div>
        </div>
        
        <div className="profile-stats">
          <div className="stat-item">
            <h3>{userPosts.length}</h3>
            <span>Posts</span>
          </div>
          <div className="stat-item">
            <h3>{followStats.followersCount}</h3>
            <span>Followers</span>
          </div>
          <div className="stat-item">
            <h3>{followStats.followingCount}</h3>
            <span>Following</span>
          </div>
        </div>
      </motion.div>

      <h2 className="section-title"><FaPenNib /> My Published Posts</h2>

      {/* 📦 User's Posts */}
      {loading ? (
        <p>Loading your posts...</p>
      ) : userPosts.length > 0 ? (
        <div className="posts-list">
          {userPosts.map(post => (
            <PostCard key={post.id} post={post} refresh={fetchUserPosts} />
          ))}
        </div>
      ) : (
        <div className="card empty-state">
          <p>You haven't published any posts yet. Start writing today!</p>
        </div>
      )}
    </div>
  );
}

export default Profile;
