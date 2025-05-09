import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const SpecificCategory = () => {
  const { categoryId } = useParams(); // Extract categoryId from the URL
  const [posts, setPosts] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    const fetchCategoryContent = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          `http://localhost:8080/api/v1/content/category/${categoryId}`,
          {
            params: {
              sort: "latest", // Default sort
              page,
              limit,
            },
          }
        );

        if (response.data.success) {
          setPosts(response.data.data);
          setCategoryName(response.data.data[0]?.category?.name || "Category");
        } else {
          setError("Failed to fetch category content");
        }
      } catch (err) {
        console.error("Error fetching category content:", err);
        setError("An error occurred while fetching category content.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryContent();
  }, [categoryId, page]);

  const handleNextPage = () => setPage((prev) => prev + 1);
  const handlePreviousPage = () => setPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-gray-800 to-navy-700 text-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-coral-500 mb-6">
          {categoryName}
        </h1>

        {loading ? (
          <p className="text-center text-lg">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : posts.length === 0 ? (
          <p className="text-center text-gray-400">No posts found in this category.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white dark:bg-navy-800 rounded-lg shadow-lg p-4 transition-transform transform hover:scale-105"
              >
                <h2 className="text-xl font-semibold text-navy-900 dark:text-cream mb-2">
                  {post.title}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {post.description || "No description available."}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={post.user.profileImage || "/default-profile.png"}
                      alt={post.user.username}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {post.user.username}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(post.postDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && posts.length > 0 && (
          <div className="flex justify-center mt-8 gap-4">
            <button
              onClick={handlePreviousPage}
              disabled={page === 1}
              className={`px-4 py-2 rounded-lg ${
                page === 1
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-coral-500 hover:bg-coral-600"
              } text-white`}
            >
              Previous
            </button>
            <button
              onClick={handleNextPage}
              className="px-4 py-2 rounded-lg bg-coral-500 hover:bg-coral-600 text-white"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpecificCategory;