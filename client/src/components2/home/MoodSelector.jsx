import React from 'react';
import { motion } from 'framer-motion';

const moods = [
{
  id: 'discover',
  name: 'Discover',
  icon: '🔍',
  color: 'bg-purple-500'
},
{
  id: 'adventurous',
  name: 'Adventurous',
  icon: '🏔️',
  color: 'bg-teal-500'
},
{
  id: 'relaxed',
  name: 'Relaxed',
  icon: '🧘',
  color: 'bg-blue-400'
},
{
  id: 'efficient',
  name: 'Efficient',
  icon: '⏱️',
  color: 'bg-amber-500'
},
{
  id: 'cultured',
  name: 'Cultured',
  icon: '🎭',
  color: 'bg-indigo-500'
},
{
  id: 'budget',
  name: 'Budget-friendly',
  icon: '💰',
  color: 'bg-green-500'
},
{
  id: 'luxurious',
  name: 'Luxurious',
  icon: '✨',
  color: 'bg-yellow-500'
}
];

const MoodSelector = ({ currentMood, setCurrentMood }) => {
return (
  <div className="container mx-auto px-4">
    <div className="bg-white dark:bg-navy-800 rounded-xl p-3 shadow-md">
      <div className="flex items-center justify-between">
        <span className="text-sm text-navy-700 dark:text-gray-300 px-3">I'm feeling:</span>
        <div className="flex overflow-x-auto hide-scrollbar gap-2">
          {moods.map(mood => (
            <button
              key={mood.id}
              onClick={() => setCurrentMood(mood.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all whitespace-nowrap ${
                currentMood === mood.id 
                  ? 'bg-coral-500 text-white' 
                  : 'bg-light-cream dark:bg-navy-700 text-navy-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-navy-600'
              }`}
            >
              <span>{mood.icon}</span>
              <span className="text-sm font-medium">{mood.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  </div>
);
};

export default MoodSelector;