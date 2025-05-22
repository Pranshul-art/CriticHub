import React, { useEffect, useState } from "react";
import axios from "axios";

const Followers = () => {
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/v1/user/followers`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (res.data.success && Array.isArray(res.data.data)) {
          setFollowers(res.data.data);
        } else {
          setFollowers([]);
        }
      } catch (err) {
        setFollowers([]);
      }
      setLoading(false);
    };
    fetchFollowers();
  }, []);

  return (
    <div className="bg-white dark:bg-navy-800 rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold text-coral-500 mb-4">
        Followers
        <span className="ml-2 text-base text-gray-600 dark:text-gray-300 font-normal">
          ({followers ? followers.length : 0})
        </span>
      </h2>
      {loading ? (
        <p className="text-gray-500 text-center">Loading followers...</p>
      ) : followers && followers.length === 0 ? (
        <p className="text-gray-400 text-center">No followers yet.</p>
      ) : (
        <ul className="space-y-4">
          {(followers || []).map((follower) => (
            <li key={follower.id} className="flex items-center gap-4">
              {follower.profileImage ? (
                <img
                  src={follower.profileImage}
                  alt={follower.username}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-navy-900 flex items-center justify-center">
                  <span className="text-white font-bold">
                    {follower.username
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                      .toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <p className="font-semibold text-navy-900 dark:text-cream">
                  {follower.username}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {follower.tag}
                </p>
              </div>
              {follower.isCritic && (
                <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-coral-500 text-white">
                  Critic
                </span>
              )}
              {follower.isVerified && (
                <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-green-500 text-white">
                  Verified
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Followers;