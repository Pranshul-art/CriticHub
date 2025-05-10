import React, { useEffect, useState } from "react";
import ItineraryCard from "../components2/itineraries/ItinerariesCard";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Corrected import

const Itineraries = () => {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loggedInUserId, setLoggedInUserId] = useState(null);

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("token");
        if (token) {
          const decodedToken = jwtDecode(token); // Corrected usage
          setLoggedInUserId(decodedToken.userId); // Extract userId from the token
        }

        const response = await axios.get("http://localhost:8080/api/v1/content/featured", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setItineraries(response.data.data);
        } else {
          setError("Failed to fetch itineraries.");
        }
      } catch (err) {
        console.error("Error fetching itineraries:", err);
        setError("An error occurred while fetching itineraries.");
      } finally {
        setLoading(false);
      }
    };

    fetchItineraries();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-navy-900 text-gray-800 dark:text-gray-100">
      <div className="container mx-auto px-4 py-8 pt-20 w-11/12 md:w-3/4 lg:w-1/2">
        {loading ? (
          <p className="text-center text-lg">Loading itineraries...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : itineraries.length === 0 ? (
          <p className="text-center text-gray-500">No itineraries found.</p>
        ) : (
          <div className="space-y-6">
            {itineraries.map((itinerary) => (
              <ItineraryCard key={itinerary.id} itinerary={itinerary} loggedInUserId={loggedInUserId} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Itineraries;