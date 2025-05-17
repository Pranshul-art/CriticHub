import React, { useEffect, useState } from "react";
import { Clock, Heart, MapPin, MessageCircle, Share2, X } from "lucide-react";
import axios from "axios";
import CommentSection from "./CommentSection";

const ItineraryCard = ({ itinerary, loggedInUserId }) => {
  const [liked, setLiked] = useState(false);
  const [fullContent, setFullContent] = useState(false);
  const [isFollowing, setIsFollowing] = useState(itinerary.user.isFollowed);
  const [showComments, setShowComments] = useState(false);
  const [showShare, setShowShare] = useState(false);

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
        { followingId: itinerary.user.id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        setIsFollowing(!isFollowing);
      }
    } catch (error) {
      console.error("Error toggling follow state:", error);
    }
  };

  // Generate the post link (adjust as per your routing)
  const postUrl = `${window.location.origin}/explore/category/${itinerary.category.id}?post=${itinerary.id}`;

  // 3-line clamp for description
  const getClampedDescription = (text) => {
    const lines = text.split("\n");
    let count = 0,
      result = "";
    for (let line of lines) {
      if (count >= 3) break;
      result += line + "\n";
      count++;
    }
    return result.trim();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(postUrl);
    e.stopPropagation();
    setShowShare(false);
  };

  const handleWhatsAppShare = () => {
    const message = `${itinerary.title}\n${getClampedDescription(itinerary.content)}\n\n${postUrl}`;
    window.open(
      `https://wa.me/?text=${encodeURIComponent(message)}`,
      "_blank"
    );
    setShowShare(false);
  };

  return (
    <div className="relative bg-white dark:bg-navy-800 rounded-3xl shadow-md p-6 flex">
      {/* Main Card */}
      <div className="flex-1">
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
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {itinerary.user.tag}
              </p>
            </div>
          </div>

          {/* Follow Button */}
          {itinerary.user.id !== loggedInUserId && (
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
            {itinerary.uploadMedia.endsWith(".mp4") ||
            itinerary.uploadMedia.endsWith(".webm") ? (
              <video
                controls
                src={itinerary.uploadMedia}
                className="w-full max-h-screen bg-teal bg-opacity-10 rounded-lg"
              />
            ) : (
              <img
                src={itinerary.uploadMedia}
                alt={itinerary.title}
                className="w-full rounded-lg"
              />
            )}
          </div>
        )}

        {/* Content */}
        <div
          className="p-3 bg-slate-100 rounded-lg cursor-pointer"
          onClick={trunc}
        >
          <p
            className={`text-sm ${
              fullContent ? "" : "line-clamp-3"
            } text-gray-600 dark:text-gray-400`}
          >
            {itinerary.content}
          </p>
        </div>

        {/* Tags */}
        {itinerary.tags && itinerary.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4 mt-3">
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
          <button
            className="flex items-center"
            onClick={() => setShowComments(true)}
          >
            <MessageCircle size={20} className="mr-1" />
            {itinerary._count.comments}
          </button>
          <button
            className="flex items-center relative"
            onClick={() => setShowShare((s) => !s)}
          >
            <Share2 size={20} />
            {/* Share Dropdown */}
            {showShare && (
              <div className="absolute right-0 top-8 z-50 bg-white dark:bg-navy-900 border border-gray-200 dark:border-navy-700 rounded-lg shadow-lg w-56 p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-700 dark:text-gray-100">
                    Share
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowShare(false);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={18} />
                  </button>
                </div>
                <div className="mb-2">
                  <div className="font-bold text-sm mb-1">{itinerary.title}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-300 line-clamp-3">
                    {itinerary.content}
                  </div>
                </div>
                <button
                  onClick={handleWhatsAppShare}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded hover:bg-green-50 dark:hover:bg-navy-800 text-green-600 dark:text-green-400 font-medium mb-1"
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                    alt="WhatsApp"
                    className="w-5 h-5"
                  />
                  Share on WhatsApp
                </button>
                <button
                  onClick={handleCopyLink}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded hover:bg-slate-100 dark:hover:bg-navy-700 text-gray-700 dark:text-gray-200 font-medium"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.828 10.172a4 4 0 010 5.656l-3.535 3.535a4 4 0 01-5.657-5.657l1.414-1.414M10.172 13.828a4 4 0 010-5.656l3.535-3.535a4 4 0 015.657 5.657l-1.414 1.414"
                    />
                  </svg>
                  Copy Link
                </button>
              </div>
            )}
          </button>
        </div>
      </div>
      {/* Comment Section Drawer */}
      <CommentSection
        postId={itinerary.id}
        authorId={itinerary.user.id}
        open={showComments}
        onClose={() => setShowComments(false)}
      />
    </div>
  );
};

export default ItineraryCard;