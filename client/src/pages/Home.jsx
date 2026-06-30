import { useEffect, useState } from "react";
import { getPosts } from "../services/api";
import PostCard from "../components/PostCard";
import { motion } from "framer-motion";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortType, setSortType] = useState("latest");

  const [page, setPage] = useState(0); // 0-indexed for Spring backend
  const [totalPages, setTotalPages] = useState(1);
  const postsPerPage = 5;

  const categories = ["Technology", "Lifestyle", "Travel", "Business", "Food", "Design"];

  // ================= FETCH POSTS =================
  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError("");

      const direction = sortType === "latest" ? "desc" : "asc";
      const res = await getPosts({
        search: search.trim() || undefined,
        category: selectedCategory || undefined,
        page: page,
        size: postsPerPage,
        sortBy: "createdAt",
        direction: direction
      });

      if (res.data && res.data.content) {
        setPosts(res.data.content);
        setTotalPages(res.data.totalPages || 1);
      } else {
        setPosts(Array.isArray(res.data) ? res.data : []);
        setTotalPages(1);
      }
    } catch (err) {
      console.error(err);
      setError(typeof err === "string" ? err : "Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  // Fetch when page, category, or sort changes
  useEffect(() => {
    fetchPosts();
  }, [page, selectedCategory, sortType]);

  // Debounced fetch for search + reset page
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(0);
      fetchPosts();
    }, 450);
    return () => clearTimeout(timer);
  }, [search]);

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    setPage(0);
  };

  return (
    <div className="container">
      <h1>All Posts</h1>

      {/* 🏷️ Category Pills */}
      <div 
        className="category-filters" 
        style={{ 
          display: 'flex', 
          gap: '10px', 
          flexWrap: 'wrap', 
          marginBottom: '20px',
          overflowX: 'auto',
          paddingBottom: '5px'
        }}
      >
        <button
          onClick={() => handleCategorySelect("")}
          className={`category-pill ${selectedCategory === "" ? "active" : ""}`}
          style={{
            padding: '8px 16px',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            background: selectedCategory === "" ? '#a29bfe' : 'rgba(255, 255, 255, 0.05)',
            color: selectedCategory === "" ? '#13131a' : '#fff',
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'all 0.2s'
          }}
        >
          All Categories
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => handleCategorySelect(cat)}
            className={`category-pill ${selectedCategory === cat ? "active" : ""}`}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: selectedCategory === cat ? '#a29bfe' : 'rgba(255, 255, 255, 0.05)',
              color: selectedCategory === cat ? '#13131a' : '#fff',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.2s'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 🔍 Search + Sort */}
      <div className="card flex">
        <input
          type="text"
          placeholder="🔍 Search posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={sortType}
          onChange={(e) => {
            setSortType(e.target.value);
            setPage(0);
          }}
        >
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>

      {/* 🔄 Loading (Skeleton State) */}
      {loading && (
        <SkeletonTheme baseColor="rgba(255,255,255,0.05)" highlightColor="rgba(255,255,255,0.1)">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[1, 2, 3].map((i) => (
              <div key={i} className="card" style={{ border: 'none' }}>
                <Skeleton height={30} width="60%" style={{ marginBottom: '15px' }} />
                <Skeleton count={3} />
                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                  <Skeleton width={100} height={35} borderRadius={10} />
                  <Skeleton width={80} height={35} borderRadius={10} />
                </div>
              </div>
            ))}
          </div>
        </SkeletonTheme>
      )}

      {/* ❌ Error */}
      {!loading && error && (
        <p style={{ color: "red" }}>{error}</p>
      )}

      {/* 📭 Empty */}
      {!loading && !error && posts.length === 0 && (
        <p>No posts found</p>
      )}

      {/* 📦 Posts */}
      {!loading && !error && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {posts.map((post) => (
            <motion.div key={post.id} variants={itemVariants}>
              <PostCard
                post={post}
                refresh={fetchPosts}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* 📄 Pagination */}
      {!loading && totalPages > 1 && (
        <div className="pagination">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={page === 0}
            onClick={() => {
              setPage((prev) => Math.max(0, prev - 1));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            Prev
          </motion.button>

          <span className="page-indicator">
            Page <strong>{page + 1}</strong> of {totalPages}
          </span>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={page + 1 >= totalPages}
            onClick={() => {
              setPage((prev) => prev + 1);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            Next
          </motion.button>
        </div>
      )}
    </div>
  );
}

export default Home;