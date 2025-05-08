import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Mock search suggestions
const searchSuggestions = [
{ id: 1, text: "Best universities for computer science", type: "popular" },
{ id: 2, text: "Hidden beaches in Goa", type: "popular" },
{ id: 3, text: "Top restaurants in New York", type: "popular" },
{ id: 4, text: "24 hours in Tokyo", type: "popular" },
{ id: 5, text: "Best coffee shops for studying", type: "recent" },
{ id: 6, text: "Student housing reviews", type: "recent" }
];

// Mock recent searches
const recentSearches = [
{ id: 1, text: "MIT vs Stanford" },
{ id: 2, text: "Affordable restaurants in London" },
{ id: 3, text: "Best time to visit Kyoto" }
];

const SearchOverlay = ({ onClose }) => {
const [searchTerm, setSearchTerm] = useState('');
const [filteredSuggestions, setFilteredSuggestions] = useState([]);
const inputRef = useRef(null);

useEffect(() => {
  // Focus input when overlay opens
  inputRef.current?.focus();
  
  // Filter suggestions based on search term
  if (searchTerm.trim() === '') {
    setFilteredSuggestions(searchSuggestions);
  } else {
    const filtered = searchSuggestions.filter(suggestion => 
      suggestion.text.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSuggestions(filtered);
  }
}, [searchTerm]);

return (
  <AnimatePresence>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-navy-900 bg-opacity-70 backdrop-blur-md z-50 flex items-start justify-center pt-20"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-navy-800 rounded-xl shadow-2xl w-full max-w-3xl mx-4"
        onClick={e => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="relative">
          <div className="flex items-center border-b border-gray-200 dark:border-navy-700 p-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search experiences, places, schools..."
              className="w-full px-4 py-2 outline-none text-lg text-navy-900 dark:text-cream bg-transparent"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Search content */}
          <div className="p-4 max-h-[80vh] overflow-y-auto">
            {/* Search suggestions */}
            {filteredSuggestions.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-2">Suggestions</h3>
                <div className="space-y-2">
                  {filteredSuggestions.map(suggestion => (
                    <button
                      key={suggestion.id}
                      className="flex items-center gap-3 w-full p-3 hover:bg-light-cream dark:hover:bg-navy-700 rounded-lg transition-colors"
                      onClick={() => setSearchTerm(suggestion.text)}
                    >
                      <div className="flex-shrink-0">
                        {suggestion.type === 'popular' ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-coral-500 " viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                      </div>
                      <span className="text-navy-900 dark:text-cream">{suggestion.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Recent searches */}
            {searchTerm.trim() === '' && recentSearches.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm text-gray-500 dark:text-gray-400">Recent Searches</h3>
                  <button className="text-xs text-coral-500 hover:text-coral-600 dark:hover:text-coral-400">Clear all</button>
                </div>
                <div className="space-y-2">
                  {recentSearches.map(search => (
                    <button
                      key={search.id}
                      className="flex items-center gap-3 w-full p-3 hover:bg-light-cream dark:hover:bg-navy-700 rounded-lg transition-colors"
                      onClick={() => setSearchTerm(search.text)}
                    >
                      <div className="flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <span className="text-navy-900 dark:text-cream">{search.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SearchOverlay;
