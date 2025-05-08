import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Campus from '../../assets/Campus.jpeg';
import HiddenGoa from '../../assets/HiddenGoa.webp';
import ArtSchool from '../../assets/ArtSchool.jpg';
import MumbaiFood from '../../assets/MumbaiFood.avif';

// Mock data for personalized recommendations
const personalizedItems = [
{
  id: 1,
  title: "The Campus Housing They Don't Show on Tours",
  type: "education",
  category: "education",
  image: Campus,
  reason: "Based on your interest in university reviews",
  author: {
    name: "Taylor Wilson",
    avatar: "/api/placeholder/40/40"
  },
  readTime: 8
},
{
  id: 2,
  title: "Hidden Beaches of Goa Only Locals Know",
  type: "place",
  category: "travel",
  image: HiddenGoa,
  reason: "Because you saved '20 Hours in Goa'",
  author: {
    name: "Raj Patel",
    avatar: "/api/placeholder/40/40"
  },
  readTime: 6
},
{
  id: 3,
  title: "The Art Schools Worth Your Money in 2025",
  type: "education",
  category: "education",
  image: ArtSchool,
  reason: "Based on your browsing history",
  author: {
    name: "Nina Chen",
    avatar: "/api/placeholder/40/40"
  },
  readTime: 15
},
{
  id: 4,
  title: "Authentic Street Food in Mumbai: A Guide",
  type: "guide",
  category: "food",
  image: MumbaiFood,
  reason: "Because you follow Priya Sharma",
  author: {
    name: "Priya Sharma",
    avatar: "/api/placeholder/40/40"
  },
  readTime: 12
}
];

const PersonalizedFeed = () => {
return (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {personalizedItems.map((item, index) => (
      <motion.div
        key={item.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 * index }}
        className="bg-white dark:bg-navy-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all"
      >
        <Link to={`/detail/${item.type}/${item.id}`} className="flex h-full">
          <div className="w-1/3">
            <img 
              src={item.image} 
              alt={item.title} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-2/3 p-5 flex flex-col justify-between">
            <div>
              <div className="mb-2 text-xs text-coral-500 font-medium flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {item.reason}
              </div>
              
              <h3 className="font-serif text-lg font-bold mb-2 text-navy-900 dark:text-cream">{item.title}</h3>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <img 
                  src={item.author.avatar} 
                  alt={item.author.name} 
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-sm text-navy-900 dark:text-cream">{item.author.name}</span>
              </div>
              
              <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                {item.readTime} min read
              </span>
            </div>
          </div>
        </Link>
      </motion.div>
    ))}
  </div>
);
};

export default PersonalizedFeed;