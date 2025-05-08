import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import GoaBeachImage from '../../assets/GoaBeach.png';
import MITvsStan from '../../assets/MITvsStan.jpeg';
import Alinea from '../../assets/Alinea.png';
import Kyoto from '../../assets/Kyoto.jpeg';

// Mock data for featured critiques
const critiques = [
  {
    id: 1,
    title: "The Hidden Beaches of Goa",
    image: GoaBeachImage,
    category: "travel",
    image: GoaBeachImage,
    author: {
      name: "Anjali Mehta",
      avatar: "/api/placeholder/40/40",
      verified: true
    },
    rating: 4.8,
    tags: ["peaceful", "scenic", "off-the-beaten-path"],
    snippet: "Forget the tourist-packed beaches. The real magic of Goa hides in these secluded shores...",
    readTime: 8,
    mood: ["adventurous", "relaxed"]
  },
  {
    id: 2,
    title: "MIT vs Stanford: The Real Student Experience",
    type: "education",
    category: "education",
    image: MITvsStan,
    author: {
      name: "James Chen",
      avatar: "/api/placeholder/40/40",
      verified: true
    },
    rating: 4.9,
    tags: ["university", "computer-science", "campus-life"],
    snippet: "As someone who transferred between these elite institutions, here's the unfiltered truth about what sets them apart...",
    readTime: 12,
    mood: ["cultured", "discover"]
  },
  {
    id: 3,
    title: "Alinea: Revolutionary or Overrated?",
    type: "restaurant",
    category: "food",
    image: Alinea,
    author: {
      name: "Michelle Rodriguez",
      avatar: "/api/placeholder/40/40",
      verified: true
    },
    rating: 4.2,
    tags: ["fine-dining", "molecular-gastronomy", "chicago"],
    snippet: "The three-Michelin starred restaurant has a sterling reputation, but is the experience worth the price tag?",
    readTime: 10,
    mood: ["luxurious", "cultured"]
  },
  {
    id: 4,
    title: "6 Hours in Kyoto: The Perfect Itinerary",
    type: "itinerary",
    category: "travel",
    image: Kyoto,
    author: {
      name: "Kenji Tanaka",
      avatar: "/api/placeholder/40/40",
      verified: true
    },
    rating: 4.9,
    tags: ["japan", "temples", "efficient"],
    snippet: "Limited time in the ancient capital? Here's how to experience the essence of Kyoto in just six hours...",
    readTime: 15,
    mood: ["adventurous", "efficient"]
  }
];

const FeaturedCritiques = ({ mood }) => {
  // Filter critiques based on mood if selected
  const filteredCritiques = mood === 'discover' 
    ? critiques 
    : critiques.filter(critique => critique.mood.includes(mood));
    
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {filteredCritiques.map((critique, index) => (
        <motion.div
          key={critique.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          className="bg-white dark:bg-navy-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all"
        >
          <Link to={`/detail/${critique.type}/${critique.id}`}>
            <div className="relative">
              <img 
                src={critique.image} 
                alt={critique.title} 
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-3 left-3 bg-white dark:bg-navy-800 px-3 py-1 rounded-full text-xs font-medium text-navy-900 dark:text-cream shadow-sm">
                {critique.category.charAt(0).toUpperCase() + critique.category.slice(1)}
              </div>
              
              {critique.type === 'itinerary' && (
                <div className="absolute top-3 right-3 bg-coral-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-sm flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Itinerary
                </div>
              )}
            </div>
            
            <div className="p-5">
              <h3 className="font-serif text-xl font-bold mb-3 text-navy-900 dark:text-cream">{critique.title}</h3>
              
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                {critique.snippet}
              </p>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <img 
                    src={critique.author.avatar} 
                    alt={critique.author.name} 
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium text-navy-900 dark:text-cream">{critique.author.name}</span>
                      {critique.author.verified && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-teal" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-coral-500 " viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-sm font-medium text-navy-900 dark:text-cream">{critique.rating}</span>
              </div>
            </div>
            
            <div className="mt-4 flex items-center justify-between">
              <div className="flex gap-2">
                {critique.tags.slice(0, 2).map(tag => (
                  <span key={tag} className="px-2 py-1 bg-light-cream dark:bg-navy-700 rounded-full text-xs text-navy-700 dark:text-gray-300">
                    {tag}
                  </span>
                ))}
                {critique.tags.length > 2 && (
                  <span className="px-2 py-1 bg-light-cream dark:bg-navy-700 rounded-full text-xs text-navy-700 dark:text-gray-300">
                    +{critique.tags.length - 2}
                  </span>
                )}
              </div>
              
              <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                {critique.readTime} min read
              </span>
            </div>
          </div>
        </Link>
      </motion.div>
    ))}
  </div>
);
};

export default FeaturedCritiques;