import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const CommentSection = ({ postId, authorId, onClose, open, theme }) => {
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);

  useEffect(() => {
    if (open) {
      fetchComments();
    }
    // eslint-disable-next-line
  }, [open]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8080/api/v1/content/${postId}/comments`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        // Prioritize author's comment
        const authorComments = res.data.data.filter(c => c.userId === authorId);
        const otherComments = res.data.data.filter(c => c.userId !== authorId);
        setComments([...authorComments, ...otherComments]);
      }
    } catch (err) {
      setComments([]);
    }
    setLoading(false);
  };

  const handleComment = async () => {
    if (!commentInput.trim()) return;
    try {
      const res = await axios.post(
        `http://localhost:8080/api/v1/content/${postId}/comments`,
        { comment: commentInput },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        setCommentInput("");
        fetchComments();
      }
    } catch (err) {
      // Optionally show error
    }
  };

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (sectionRef.current && !sectionRef.current.contains(event.target)) {
        onClose();
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={sectionRef}
      className={`fixed top-0 right-0 h-full w-full max-w-md z-50 bg-white dark:bg-navy-900 shadow-lg border-l border-gray-200 dark:border-navy-700 flex flex-col transition-all duration-300`}
      style={{ maxHeight: "100vh" }}
    >
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-navy-700">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Comments</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl">&times;</button>
      </div>
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {loading ? (
          <p className="text-center text-gray-500">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-center text-gray-400">No comments yet.</p>
        ) : (
          comments.map((comment, idx) => (
            <div
              key={comment.id}
              className={`rounded-lg p-3 ${comment.userId === authorId
                ? "bg-coral-100 dark:bg-coral-900 border-l-4 border-coral-500"
                : "bg-slate-100 dark:bg-navy-800"
              }`}
            >
              <div className="flex items-center mb-1">
                <span className="font-bold text-sm text-navy-900 dark:text-coral-200">
                  {comment.user?.username || "User"}
                  {comment.userId === authorId && (
                    <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-coral-500 text-white">Author</span>
                  )}
                </span>
                <span className="ml-2 text-xs text-gray-400">
                  {new Date(comment.createdAt).toLocaleString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </span>
              </div>
              <div className="text-gray-700 dark:text-gray-200 text-sm">{comment.comment}</div>
            </div>
          ))
        )}
      </div>
      <div className="p-4 border-t border-gray-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-800">
        <div className="flex">
          <input
            type="text"
            className="flex-1 rounded-l-lg px-3 py-2 border border-gray-300 dark:border-navy-700 bg-white dark:bg-navy-900 text-gray-800 dark:text-gray-100 focus:outline-none"
            placeholder="Add a comment..."
            value={commentInput}
            onChange={e => setCommentInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleComment()}
          />
          <button
            onClick={handleComment}
            className="bg-coral-500 hover:bg-coral-600 text-white px-4 py-2 rounded-r-lg font-semibold"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentSection;