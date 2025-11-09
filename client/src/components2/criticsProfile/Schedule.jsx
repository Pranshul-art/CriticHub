import React, { useState } from "react";
import axios from "axios";

const Schedule = ({ onSuccess }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [duration, setDuration] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSchedule = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await axios.post("http://localhost:8080/api/v1/content/schedule", {
        title,
        content,
        scheduledAt,
        duration: Number(duration),
      },{
        headers:{
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      setTitle("");
      setContent("");
      setScheduledAt("");
      setDuration("");
      if (onSuccess) onSuccess();
    } catch (err) {
      setError("Failed to schedule post.");
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSchedule} className="space-y-4 p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-2">Schedule a Post</h2>
      <input
        className="w-full border p-2 rounded"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />
      <textarea
        className="w-full border p-2 rounded"
        placeholder="Content"
        value={content}
        onChange={e => setContent(e.target.value)}
        required
      />
      <input
        className="w-full border p-2 rounded"
        type="datetime-local"
        value={scheduledAt}
        onChange={e => setScheduledAt(e.target.value)}
        required
      />
      <input
        className="w-full border p-2 rounded"
        type="number"
        min="1"
        placeholder="Duration (hours)"
        value={duration}
        onChange={e => setDuration(e.target.value)}
        required
      />
      {error && <div className="text-red-500">{error}</div>}
      <button
        type="submit"
        className="bg-coral-500 text-white px-4 py-2 rounded"
        disabled={isLoading}
      >
        {isLoading ? "Scheduling..." : "Schedule Post"}
      </button>
    </form>
  );
};

export default Schedule;