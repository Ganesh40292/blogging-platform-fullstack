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
  const [filteredPosts, setFilteredPosts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [sortType, setSortType] = useState("latest");

  const [page, setPage] = useState(1);
  const postsPerPage = 5;

  // ================= FETCH POSTS =================
  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getPosts();

      const data = Array.isArray(res.data) ? res.data : [];

      setPosts(data);
      setFilteredPosts(data);
    } catch (err) {
      console.error(err);
      setError(typeof err === "string" ? err : "Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // ================= FILTER + SORT =================
  useEffect(() => {
    let temp = [...posts];

    // 🔍 Search
    if (search.trim()) {
      temp = temp.filter((p) =>
        p.title?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // 🔃 Sort
    temp.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);

      return sortType === "latest" ? dateB - dateA : dateA - dateB;
    });

    setFilteredPosts(temp);
    setPage(1);
  }, [search, sortType, posts]);

  // ================= PAGINATION =================
  const start = (page - 1) * postsPerPage;
  const paginatedPosts = filteredPosts.slice(start, start + postsPerPage);
  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / postsPerPage));

  return (
    <div className="container">
      <h1>All Posts</h1>

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
          onChange={(e) => setSortType(e.target.value)}
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
      {!loading && !error && filteredPosts.length === 0 && (
        <p>No posts found</p>
      )}

      {/* 📦 Posts */}
      {!loading && !error && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {paginatedPosts.map((post) => (
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
            disabled={page === 1}
            onClick={() => {
              setPage((prev) => prev - 1);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            Prev
          </motion.button>

          <span className="page-indicator">
            Page <strong>{page}</strong> of {totalPages}
          </span>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={page === totalPages}
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