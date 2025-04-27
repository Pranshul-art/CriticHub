import { Clock, Heart, MapPin, MessageCircle, Share2 } from "lucide-react";
import { useState } from "react";

const ItineraryCard = ({ itinerary }) => {
    const [liked, setLiked] = useState(false);
    
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="p-4">
          <div className="flex items-center mb-3">
            <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
              <img src={itinerary.profilePic} alt={itinerary.author} className="h-full w-full object-cover" />
            </div>
            <div>
              <div className="font-bold text-gray-900">{itinerary.author}</div>
              <div className="text-xs text-gray-500">{itinerary.timestamp}</div>
            </div>
          </div>
          
          <h3 className="text-xl font-bold mb-2">{itinerary.title}</h3>
          
          <div className="flex items-center mb-3 text-sm text-gray-600">
            <div className="flex items-center mr-4">
              <MapPin size={16} className="mr-1" />
              {itinerary.location}
            </div>
            <div className="flex items-center">
              <Clock size={16} className="mr-1" />
              {itinerary.duration}
            </div>
          </div>
          
          <p className="text-gray-700 mb-4">{itinerary.content}</p>
          
          <div className="relative rounded-lg overflow-hidden mb-4">
            <img src={itinerary.media} alt={itinerary.title} className="w-full h-64 object-cover" />
            {itinerary.isVideo && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black bg-opacity-50 rounded-full p-3">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap mb-4">
            {itinerary.tags.map(tag => (
              <span key={tag} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full mr-2 mb-2">
                #{tag}
              </span>
            ))}  
          </div>
          
          <div className="flex items-center justify-between text-gray-500 border-t pt-3">
            <button 
              className={`flex items-center ${liked ? 'text-red-500' : ''}`} 
              onClick={() => setLiked(!liked)}
            >
              <Heart size={20} className={`mr-1 ${liked ? 'fill-current' : ''}`} />
              {itinerary.likes + (liked ? 1 : 0)}
            </button>
            <button className="flex items-center">
              <MessageCircle size={20} className="mr-1" />
              {itinerary.comments}
            </button>
            <button className="flex items-center">
              <Share2 size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  };

export default ItineraryCard;