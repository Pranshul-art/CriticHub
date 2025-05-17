import React, { useState } from "react";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import axios from "axios";

const ItineraryCard = ({ itinerary, loggedInUserId }) => {
  const [liked, setLiked] = useState(itinerary.isLiked); // Initial state from backend
  const [likeCount, setLikeCount] = useState(itinerary._count.likes); // Initial like count

  const handleLikeToggle = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/v1/content/${itinerary.id}/like`,
        { userId: loggedInUserId }, // Pass the userId in the request body
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Include the auth token
          },
        }
      );

      if (response.data.success) {
        // Toggle the like state and update the like count
        setLiked(!liked);
        setLikeCount((prevCount) => (liked ? prevCount - 1 : prevCount + 1));
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  return (
    <div className="bg-white dark:bg-navy-800 rounded-3xl shadow-md p-6">
      {/* Title */}
      <h2 className="text-xl font-semibold mb-2">{itinerary.title}</h2>

      {/* Media */}
      {itinerary.uploadMedia && (
        <div className="mb-4">
          {itinerary.uploadMedia.endsWith(".mp4") || itinerary.uploadMedia.endsWith(".webm") ? (
            <video controls src={itinerary.uploadMedia} className="w-full rounded-lg" />
          ) : (
            <img src={itinerary.uploadMedia} alt={itinerary.title} className="w-full rounded-lg" />
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-3 bg-slate-100 rounded-lg">
        <p className="text-sm text-gray-600 dark:text-gray-400">{itinerary.content}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between text-gray-500 border-t pt-3">
        <button
          className={`flex items-center ${liked ? "text-red-500" : ""}`}
          onClick={handleLikeToggle}
        >
          <Heart size={20} className={`mr-1 ${liked ? "fill-current" : ""}`} />
          {likeCount}
        </button>
        <button className="flex items-center">
          <MessageCircle size={20} className="mr-1" />
          {itinerary._count.comments}
        </button>
        <button className="flex items-center">
          <Share2 size={20} />
        </button>
      </div>
    </div>
  );
};

export default ItineraryCard;