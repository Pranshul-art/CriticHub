import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import NYC from '../../assets/NYC.jpeg';
import Goa from '../../assets/GoaUltimate.jpg';
import Sip from '../../assets/Sip.jpeg';
// Mock data for trending items
const trendingItems = [
{
  id: 1,
  title: "The Truth About NYU's Film School",
  type: "education",
  category: "education",
  image: NYC,
  trendingFactor: 486, // Number of views/saves in last 24h
  author: {
    name: "David Kim",
    avatar: "/api/placeholder/40/40"
  },
  controversyScore: 0.8 // 0-1 scale of how divided the opinions are
},
{
  id: 2,
  title: "20 Hours in Goa: The Ultimate Guide",
  type: "itinerary",
  category: "travel",
  image: Goa,
  trendingFactor: 752,
  author: {
    name: "Priya Sharma",
    avatar: "/api/placeholder/40/40"
  },
  controversyScore: 0.2
},
{
  id: 3,
  title: "The Hidden Speakeasy Everyone's Talking About",
  type: "place",
  category: "nightlife",
  image: Sip,
  trendingFactor: 943,
  author: {
    name: "Miguel Rodriguez",
    avatar: "/api/placeholder/40/40"
  },
  controversyScore: 0.5
},
{
  id: 4,
  title: "This New Restaurant Is Worth The Hype",
  type: "restaurant",
  category: "food",
  image: "/api/placeholder/600/400",
  trendingFactor: 621,
  author: {
    name: "Sarah Johnson",
    avatar: "/api/placeholder/40/40"
  },
  controversyScore: 0.7
},
{
  id: 5,
  title: "College Tour Guide: What They Don't Tell You",
  type: "education",
  category: "education",
  image: "/api/placeholder/600/400",
  trendingFactor: 529,
  author: {
    name: "Tyler Washington",
    avatar: "/api/placeholder/40/40"
  },
  controversyScore: 0.9
}
];

const TrendingSection = () => {
return (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    {/* Main trending item */}
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="lg:col-span-2 bg-white dark:bg-navy-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all"
    >
      <Link to={`/detail/${trendingItems[0].type}/${trendingItems[0].id}`} className="flex flex-col md:flex-row h-full">
        <div className="md:w-1/2">
          <img 
            src={trendingItems[0].image} 
            alt={trendingItems[0].title} 
            className="w-full h-64 md:h-full object-cover"
          />
        </div>
        <div className="md:w-1/2 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="px-3 py-1 bg-coral-500 text-white rounded-full text-sm font-medium">Trending #1</div>
              <div className="px-3 py-1 bg-light-cream dark:bg-navy-700 rounded-full text-sm text-navy-700 dark:text-gray-300">
                {trendingItems[0].category.charAt(0).toUpperCase() + trendingItems[0].category.slice(1)}
              </div>
            </div>
            
            <h3 className="font-serif text-2xl font-bold mb-4 text-navy-900 dark:text-cream">{trendingItems[0].title}</h3>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              This controversial critique has sparked intense debate among students and faculty alike, with strong opinions on both sides...
            </p>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="w-full bg-gray-200 dark:bg-navy-700 rounded-full h-2">
                <div 
                  className="bg-coral-500 h-2 rounded-full" 
                  style={{ width: `${trendingItems[0].controversyScore * 100}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                {Math.round(trendingItems[0].controversyScore * 100)}% controversial
              </span>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <img 
                src={trendingItems[0].author.avatar} 
                alt={trendingItems[0].author.name} 
                className="w-8 h-8 rounded-full"
              />
              <span className="text-sm font-medium text-navy-900 dark:text-cream">{trendingItems[0].author.name}</span>
            </div>
            
            <div className="flex items-center gap-1 text-coral-500 ">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">{trendingItems[0].trendingFactor}+ views today</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
    
    {/* Secondary trending items */}
    <div className="lg:col-span-1 space-y-6">
      {trendingItems.slice(1, 3).map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 * (index + 1) }}
          className="bg-white dark:bg-navy-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all"
        >
          <Link to={`/detail/${item.type}/${item.id}`} className="flex">
            <div className="w-1/3">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-2/3 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="px-2 py-0.5 bg-coral-500 text-white rounded-full text-xs font-medium">Trending #{index + 2}</div>
              </div>
              
              <h3 className="font-serif text-lg font-bold mb-2 text-navy-900 dark:text-cream">{item.title}</h3>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <img 
                    src={item.author.avatar} 
                    alt={item.author.name} 
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-xs text-navy-900 dark:text-cream">{item.author.name}</span>
                </div>
                
                <div className="flex items-center gap-1 text-coral-500 text-xs">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                  </svg>
                  <span>{item.trendingFactor}+</span>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  </div>
);
};
export default TrendingSection;
