import { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";

const SpecificCategory = () => {
  const { categoryId } = useParams(); // Extract categoryId from the URL
  const location = useLocation();
  const [posts, setPosts] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;
  const [selectedPost, setSelectedPost] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const hasOpenedModalRef = useRef(false);

  const openModal = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedPost(null);
    setIsModalOpen(false);
  };

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
            headers:{
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
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

  useEffect(() => {
    hasOpenedModalRef.current = false; // Reset when posts are re-fetched
  }, [categoryId, page]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const postIdToOpen = params.get("post");
    if (
      postIdToOpen &&
      posts.length > 0 &&
      !isModalOpen &&
      !hasOpenedModalRef.current
    ) {
      const postToOpen = posts.find((p) => p.id === postIdToOpen);
      if (postToOpen) {
        openModal(postToOpen);
        hasOpenedModalRef.current = true;
      }
    }
    // eslint-disable-next-line
  }, [location.search, posts, isModalOpen]);

  const handleNextPage = () => setPage((prev) => prev + 1);
  const handlePreviousPage = () => setPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className="min-h-screen bg-gradient-to-br  from-navy-900 via-gray-800 to-navy-700 text-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-coral-500 mb-6 mt-20">
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
                className="bg-white dark:bg-navy-800 rounded-lg shadow-lg p-4 transition-transform transform hover:scale-105 cursor-pointer"
                onClick={() => openModal(post)} 
              >
                <h2 className="text-xl font-semibold text-navy-900 dark:text-cream mb-2">
                  {post.title}
                </h2>
                <p className="text-sm truncate text-gray-600 dark:text-gray-400 mb-4">
                  {post.content || "No description available."}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {post.user.profileImage ? (
                      <img
                        src={post.user.profileImage}
                        alt={post.user.username}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-navy-900 flex items-center justify-center">
                        <span className="text-white font-bold">
                          {post.user.username
                            .split(" ")
                            .map((word) => word[0])
                            .join("")
                            .toUpperCase()}
                        </span>
                      </div>
                    )}
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

        {/* Modal */}
        {isModalOpen && selectedPost && (
          <div className="fixed inset-0   pt-20   bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-navy-800   overflow-y-scroll rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-[64%] p-6 relative max-h-screen">
              <button
                className="absolute top-4 right-4 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
                onClick={closeModal}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <h2 className="text-2xl font-bold text-navy-900 dark:text-cream mb-4">
                {selectedPost.title}
              </h2>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {selectedPost.content || "No description available."}
              </p>

              {selectedPost.uploadMedia && (
                <div className="mb-4">
                  {selectedPost.uploadMedia.endsWith(".mp4") ||
                  selectedPost.uploadMedia.endsWith(".webm") ? (
                    <video
                      controls
                      src={selectedPost.uploadMedia}
                      className="w-full rounded-lg max-h-screen bg-teal bg-opacity-10"
                    />
                  ) : (
                    <img
                      src={selectedPost.uploadMedia}
                      alt={selectedPost.title}
                      className="w-full rounded-lg"
                    />
                  )}
                </div>
              )}

              <div className="mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Duration:</strong> {selectedPost.duration || "N/A"}
                </p>
                {selectedPost.location && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Location:</strong> {selectedPost.location}
                  </p>
                )}
              </div>

              {selectedPost.tags && selectedPost.tags.length > 0 && (
                <div className="mb-4">
                  <strong className="text-sm text-gray-700 dark:text-gray-300">
                    Tags:
                  </strong>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedPost.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-coral-500 text-white text-xs font-medium px-2 py-1 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4 mb-4">
                {selectedPost.user.profileImage ? (
                  <img
                    src={selectedPost.user.profileImage}
                    alt={selectedPost.user.username}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-navy-900 flex items-center justify-center">
                    <span className="text-white font-bold">
                      {selectedPost.user.username
                        .split(" ")
                        .map((word) => word[0])
                        .join("")
                        .toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {selectedPost.user.username}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {selectedPost.user.tag}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <p>
                  <strong>Views:</strong> {selectedPost._count.views}
                </p>
                <p>
                  <strong>Comments:</strong> {selectedPost._count.comments}
                </p>
                <p>
                  <strong>Posted on:</strong>{" "}
                  {new Date(selectedPost.postDate).toLocaleDateString()}
                </p>
              </div>
            </div>
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