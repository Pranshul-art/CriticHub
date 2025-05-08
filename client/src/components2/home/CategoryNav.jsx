import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { movie } from '../../assets/svg/Movies';
import { website } from '../../assets/svg/website';

const categories = [
  {
    id:'websites',
    name: 'Websites',
    icon: website,
    count: 10023,
    color:'bg-purple-600'
  },
  {
    id:'movies',
    name: 'Movies',
    icon: movie,
    count: 42399,
    color:'bg-navy-600'
  },
  {
    id: 'food',
    name: 'Food & Drink',
    icon: '🍽️',
    count: 2453,
    color: 'bg-amber-500'
  },
  {
    id: 'travel',
    name: 'Travel & Places',
    icon: '✈️',
    count: 1879,
    color: 'bg-teal-500'
  },
  {
    id: 'education',
    name: 'Education',
    icon: '🎓',
    count: 1245,
    color: 'bg-blue-500'
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    icon: '🎭',
    count: 2089,
    color: 'bg-purple-500'
  },
  {
    id: 'shopping',
    name: 'Shopping',
    icon: '🛍️',
    count: 1652,
    color: 'bg-pink-500'
  },
  {
    id: 'wellness',
    name: 'Health & Wellness',
    icon: '🧘',
    count: 967,
    color: 'bg-green-500'
  },
  
];



const CategoryNav = () => {
  const [isScrolled, setIsScrolled]=useState(false);

  useEffect(()=>{
    const handleScroll=()=>{
      if(window.scrollY>615){
        setIsScrolled(true)
      }
      else{
        setIsScrolled(false)
      }
    };

    document.addEventListener('scroll',handleScroll);
    return()=>window.removeEventListener('scroll',handleScroll);
    
  },[]);
  return (
    <section className={`sticky top-20 z-30 bg-cream dark:bg-navy-900 shadow-md ${isScrolled? `rounded-3xl bg-navy-600`:``}`}>
      <div className="container mx-auto px-4">
        <div className="py-3 overflow-x-auto hide-scrollbar ">
          <div className="flex items-center justify-around ">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link 
                  to={`/category/${category.id}`}
                  className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-navy-800 rounded-xl shadow-sm hover:shadow-md transition-all whitespace-nowrap"
                >
                  <div className={`${category.color} w-10 h-10 rounded-lg flex items-center justify-center text-white text-xl`}>
                    {category.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-navy-900 dark:text-cream">{category.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{category.count} critiques</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryNav;