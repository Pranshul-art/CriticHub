import React, { useEffect, useState } from "react";
import axios from "axios";
import ItineraryCard from "../components2/itineraries/ItinerariesCard";

const Itineraries = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPosts = async (pageNum = 1) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(
        `http://localhost:8080/api/v1/content/featured?page=${pageNum}&limit=10`,
        {
          headers:{
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      if (res.data.success) {
        if (pageNum === 1) {
          setPosts(res.data.data);
        } else {
          setPosts((prev) => [...prev, ...res.data.data]);
        }
        setHasMore(
          res.data.pagination.page < res.data.pagination.totalPages
        );
      } else {
        setError("Failed to load posts.");
      }
    } catch (err) {
      setError("An error occurred while loading posts.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts(1);
  }, []);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(nextPage);
  };

  return (
    <div className="min-h-screen bg-gray-300 dark:bg-navy-900 text-gray-800 dark:text-gray-100">
      <div className="container mx-auto px-4 py-8 pt-20 w-11/12 md:w-3/4 lg:w-1/2">
        {error && (
          <div className="text-center text-red-500 mb-4">{error}</div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6">
          {posts.map((post) => (
            <ItineraryCard key={post.id} itinerary={post} />
          ))}
        </div>
        {hasMore && (
          <div className="flex justify-center mt-6">
            <button
              onClick={handleLoadMore}
              className="px-6 py-2 bg-coral-500 text-white rounded-lg font-semibold hover:bg-coral-600"
              disabled={loading}
            >
              {loading ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Itineraries;