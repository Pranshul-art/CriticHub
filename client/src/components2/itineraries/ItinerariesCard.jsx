import React, { useEffect, useState } from "react";
import { Clock, Heart, MapPin, MessageCircle, Share2 } from "lucide-react";
import axios from "axios";

const ItineraryCard = ({ itinerary, loggedInUserId }) => {
  const [liked, setLiked] = useState(false);
  const [fullContent, setFullContent] = useState(false);
  const [isFollowing, setIsFollowing] = useState(itinerary.user.isFollowed); // Initial state from backend

  const trunc = () => {
    setFullContent(!fullContent);
  };

  useEffect(() => {
    setFullContent(false);
  }, [window.scrollY]);

  const handleFollowToggle = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/user/follow",
        { followingId: itinerary.user.id }, // Pass the userId of the user to follow/unfollow
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Include the auth token
          },
        }
      );

      if (response.data.success) {
        setIsFollowing(!isFollowing); // Toggle the follow state
      }
    } catch (error) {
      console.error("Error toggling follow state:", error);
    }
  };

  return (
    <div className="bg-white dark:bg-navy-800 rounded-3xl shadow-md p-6">
      {/* User Info */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          {itinerary.user.profileImage ? (
            <img
              src={itinerary.user.profileImage}
              alt={itinerary.user.username}
              className="w-12 h-12 rounded-full"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-navy-900 flex items-center justify-center">
              <span className="text-white font-bold">
                {itinerary.user.username
                  .split(" ")
                  .map((word) => word[0])
                  .join("")
                  .toUpperCase()}
              </span>
            </div>
          )}
          <div className="ml-4">
            <p className="text-sm font-bold">{itinerary.user.username}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{itinerary.user.tag}</p>
          </div>
        </div>

        {/* Follow Button */}
        {itinerary.user.id !== loggedInUserId && ( // Hide button if the post belongs to the logged-in user
          <button
            onClick={handleFollowToggle}
            className={`px-4 py-1 text-sm font-medium rounded-full ${
              isFollowing
                ? "bg-gray-300 text-gray-700 hover:bg-gray-400"
                : "bg-coral-500 text-white hover:bg-coral-600"
            }`}
          >
            {isFollowing ? "Following" : "Follow"}
          </button>
        )}
      </div>

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
      <div className="p-3 bg-slate-100 rounded-lg cursor-pointer" onClick={trunc}>
        <p
          className={`text-sm ${fullContent ? "" : "line-clamp-3"} text-gray-600 dark:text-gray-400`}
        >
          {itinerary.content}
        </p>
      </div>

      {/* Tags */}
      {itinerary.tags && itinerary.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {itinerary.tags.map((tag, index) => (
            <span
              key={index}
              className="bg-navy-700 text-white text-xs font-medium px-2 py-1 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Metadata */}
      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
        <p>
          <Clock size={16} className="inline-block mr-1" />
          {itinerary.duration || "N/A"}
        </p>
        <p>
          <MapPin size={16} className="inline-block mr-1" />
          {itinerary.location || "N/A"}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between text-gray-500 border-t pt-3">
        <button
          className={`flex items-center ${liked ? "text-red-500" : ""}`}
          onClick={() => setLiked(!liked)}
        >
          <Heart size={20} className={`mr-1 ${liked ? "fill-current" : ""}`} />
          {itinerary._count.views + (liked ? 1 : 0)}
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