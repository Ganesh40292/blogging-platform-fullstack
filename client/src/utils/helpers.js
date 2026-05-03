// 🔹 Truncate text safely
export const truncateText = (text = "", limit = 100) => {
  if (typeof text !== "string") return "";
  return text.length > limit ? text.slice(0, limit) + "..." : text;
};

// 🔹 Format date nicely
export const formatDate = (dateString) => {
  if (!dateString) return "";

  try {
    return new Date(dateString).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return "";
  }
};

// 🔹 Calculate reading time
export const calculateReadingTime = (text = "") => {
  const wordsPerMinute = 200;
  const noOfWords = text.split(/\s+/).length;
  const minutes = noOfWords / wordsPerMinute;
  const readTime = Math.ceil(minutes);
  return `${readTime} min read`;
};