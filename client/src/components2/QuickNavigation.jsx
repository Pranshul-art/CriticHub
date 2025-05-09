import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const hardcodedStyles = {
  WEBSITES: {
    activityLevel: 0.89,
    backgroundColor: 'bg-rose-100 dark:bg-rose-900/30',
    iconColor: 'text-rose-600 dark:text-rose-400',
  },
  "FOOD & DINING": {
    activityLevel: 0.9,
    backgroundColor: 'bg-amber-100 dark:bg-amber-900/30',
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
  TRAVEL: {
    activityLevel: 0.85,
    backgroundColor: 'bg-blue-100 dark:bg-blue-900/30',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  EDUCATION: {
    activityLevel: 0.7,
    backgroundColor: 'bg-green-100 dark:bg-green-900/30',
    iconColor: 'text-green-600 dark:text-green-400',
  },
  ENTERTAINMENT: {
    activityLevel: 0.65,
    backgroundColor: 'bg-purple-100 dark:bg-purple-900/30',
    iconColor: 'text-purple-600 dark:text-purple-400',
  },
  NIGHTLIFE: {
    activityLevel: 0.8,
    backgroundColor: 'bg-fuchsia-100 dark:bg-fuchsia-900/30',
    iconColor: 'text-fuchsia-600 dark:text-fuchsia-400',
  },
  SHOPPING: {
    activityLevel: 0.75,
    backgroundColor: 'bg-pink-100 dark:bg-pink-900/30',
    iconColor: 'text-pink-600 dark:text-pink-400',
  },
  MOVIES: {
    activityLevel: 0.79,
    backgroundColor: 'bg-cyan-100 dark:bg-cyan-900/30',
    iconColor: 'text-cyan-600 dark:text-cyan-400',
  },
  SPORTS: {
    activityLevel: 0.59,
    backgroundColor: 'bg-emerald-100 dark:bg-emerald-900/30',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
};

const QuickNavigation = () => {
  const [categories, setCategories] = useState([]);

  // Fetch categories from the backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/content/categories', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const fetchedCategories = response.data.data.map((category) => ({
          ...category,
          ...hardcodedStyles[category.name], 
        }));

        setCategories(fetchedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, 
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 24 },
    },
  };

  return (
    <section className="py-12 bg-light-cream dark:bg-navy-900 w-full rounded-3xl">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-serif font-bold text-navy-900 dark:text-cream">Explore Categories</h2>
          <button className="text-coral-500 hover:text-coral-600 dark:hover:text-coral-400 font-medium flex items-center gap-1 transition-colors">
            <span>View All</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible" 
          viewport={{ once: true, margin: '-100px' }} 
        >
          {categories.map((category) => (
            <motion.div key={category.id} variants={itemVariants} className="relative">
              <Link to={`/explore/category/${category.id}`}>
                <div
                  className={`${category.backgroundColor} rounded-xl p-4 h-32 flex flex-col justify-between transition-all hover:shadow-lg hover:-translate-y-1 duration-300`}
                >
                  <div className="flex justify-between items-start">
                    <div
                      className={`${category.iconColor} p-2 rounded-lg bg-white dark:bg-navy-800 bg-opacity-60 dark:bg-opacity-20`}
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        fill="currentColor" 
                        className="w-6 h-6"
                      >
                        <path d={category.icon} />
                      </svg>
                    </div>

                    {/* Activity indicator */}
                    <div className="flex items-center">
                      <span className="text-xs text-gray-600 dark:text-gray-400 mr-1">
                        {Math.round(category.activityLevel * 100)}%
                      </span>
                      <div className="h-1.5 w-12 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-coral-500 dark:bg-coral-500 rounded-full"
                          style={{ width: `${category.activityLevel * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-navy-900 dark:text-cream">{category.name}</h3>
                    <p className="text-xs text-navy-700 dark:text-gray-400 mt-1">Trending Now</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile scroll indicator */}
        <div className="flex justify-center mt-6 md:hidden">
          <div className="flex gap-1">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={`h-1 w-4 rounded-full ${i === 0 ? 'bg-coral-500' : 'bg-gray-300 dark:bg-gray-700'}`}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuickNavigation;