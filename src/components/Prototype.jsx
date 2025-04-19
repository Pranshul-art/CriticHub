import React, { useState, useEffect } from 'react';
import { Search, Clock, Map, Star, Heart, Share, Filter, ChevronDown, User, Camera, BookOpen, PlusCircle } from 'lucide-react';

const ItinerariesPage = () => {
  const [activeTab, setActiveTab] = useState('discover');
  const [filterOpen, setFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      setItineraries(sampleItineraries);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredItineraries = itineraries.filter(itinerary => {
    const matchesSearch = itinerary.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          itinerary.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || itinerary.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Itineraries</h1>
            <p className="text-gray-600 mt-1">Discover curated experiences from top critics and travelers</p>
          </div>
          <button className="mt-4 md:mt-0 flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
            <PlusCircle size={18} />
            <span>Create Itinerary</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('discover')}
              className={`pb-4 px-1 ${activeTab === 'discover' ? 'border-b-2 border-indigo-600 text-indigo-600 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Discover
            </button>
            <button
              onClick={() => setActiveTab('following')}
              className={`pb-4 px-1 ${activeTab === 'following' ? 'border-b-2 border-indigo-600 text-indigo-600 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Following
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`pb-4 px-1 ${activeTab === 'saved' ? 'border-b-2 border-indigo-600 text-indigo-600 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Saved
            </button>
            <button
              onClick={() => setActiveTab('my')}
              className={`pb-4 px-1 ${activeTab === 'my' ? 'border-b-2 border-indigo-600 text-indigo-600 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
            >
              My Itineraries
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 md:items-center">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search itineraries, locations, critics..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
            <Search size={20} className="absolute left-3 top-3.5 text-gray-500" />
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg px-4 py-3 hover:bg-gray-50"
            >
              <Filter size={18} className="text-gray-700" />
              <span>Filters</span>
              <ChevronDown size={16} className="text-gray-600" />
            </button>
            
            {filterOpen && (
              <div className="absolute mt-2 right-0 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-10">
                <div className="mb-4">
                  <p className="font-medium text-gray-700 mb-2">Duration</p>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 border border-gray-300 rounded-full text-sm hover:bg-gray-100">6 h</button>
                    <button className="px-3 py-1 border border-gray-300 rounded-full text-sm hover:bg-gray-100">1 Day</button>
                    <button className="px-3 py-1 border border-gray-300 rounded-full text-sm hover:bg-gray-100">2-3 Days</button>
                  </div>
                </div>
                <div className="mb-4">
                  <p className="font-medium text-gray-700 mb-2">Categories</p>
                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={() => setSelectedCategory('all')}
                      className={`px-3 py-1 border rounded-full text-sm ${selectedCategory === 'all' ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-300 hover:bg-gray-100'}`}
                    >
                      All
                    </button>
                    <button 
                      onClick={() => setSelectedCategory('food')}
                      className={`px-3 py-1 border rounded-full text-sm ${selectedCategory === 'food' ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-300 hover:bg-gray-100'}`}
                    >
                      Food
                    </button>
                    <button 
                      onClick={() => setSelectedCategory('culture')}
                      className={`px-3 py-1 border rounded-full text-sm ${selectedCategory === 'culture' ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-300 hover:bg-gray-100'}`}
                    >
                      Culture
                    </button>
                    <button 
                      onClick={() => setSelectedCategory('adventure')}
                      className={`px-3 py-1 border rounded-full text-sm ${selectedCategory === 'adventure' ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-300 hover:bg-gray-100'}`}
                    >
                      Adventure
                    </button>
                    <button 
                      onClick={() => setSelectedCategory('nightlife')}
                      className={`px-3 py-1 border rounded-full text-sm ${selectedCategory === 'nightlife' ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-300 hover:bg-gray-100'}`}
                    >
                      Nightlife
                    </button>
                  </div>
                </div>
                <div>
                  <p className="font-medium text-gray-700 mb-2">Rating</p>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <Star 
                        key={rating}
                        size={20}
                        className="text-gray-300 hover:text-yellow-400 cursor-pointer"
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">& Up</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex space-x-2 border border-gray-300 rounded-lg overflow-hidden">
            <button 
              onClick={() => setViewMode('grid')} 
              className={`px-4 py-3 ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-3 ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
            >
              List
            </button>
          </div>
        </div>

        {/* Featured Section */}
        {activeTab === 'discover' && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Itineraries</h2>
            <div className="relative rounded-xl overflow-hidden h-96">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-70"></div>
              <img 
                src="/api/placeholder/1200/600" 
                alt="Goa beaches aerial view" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 p-8 text-white">
                <div className="flex items-center space-x-2 mb-4">
                  <span className="bg-indigo-600 text-white px-2 py-1 rounded text-sm font-medium">Featured</span>
                  <span className="bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded text-sm">24 Hours</span>
                </div>
                <h3 className="text-3xl font-bold mb-2">24 Hours in Goa: Beach Paradise</h3>
                <p className="text-white/80 mb-4 max-w-2xl">Experience the perfect day in Goa with this carefully curated itinerary that takes you from sunrise yoga on Palolem Beach to sunset cocktails at Anjuna.</p>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                      <img src="/api/placeholder/40/40" alt="Critic avatar" className="rounded-full" />
                    </div>
                    <span>by <strong>Maya Fernandes</strong></span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star size={18} className="text-yellow-400 fill-current" />
                    <span>4.8</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <BookOpen size={16} />
                    <span>12.4k views</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Popular Categories */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <div 
                key={category.id}
                className="relative rounded-lg overflow-hidden h-32 cursor-pointer group"
                onClick={() => setSelectedCategory(category.id)}
              >
                <div className="absolute inset-0 bg-black opacity-40 group-hover:opacity-60 transition"></div>
                <img 
                  src={`/api/placeholder/300/200`} 
                  alt={category.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text-xl font-bold">{category.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Itineraries Grid/List */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {activeTab === 'discover' ? 'Popular Itineraries' : 
               activeTab === 'following' ? 'From Critics You Follow' :
               activeTab === 'saved' ? 'Saved Itineraries' : 'Your Itineraries'}
            </h2>
            <select className="border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option>Most Popular</option>
              <option>Newest First</option>
              <option>Highest Rated</option>
              <option>Duration: Short to Long</option>
            </select>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : filteredItineraries.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium text-gray-700 mb-2">No itineraries found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItineraries.map((itinerary) => (
                <div key={itinerary.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition cursor-pointer border border-gray-100">
                  <div className="relative">
                    <img 
                      src={`/api/placeholder/400/240`} 
                      alt={itinerary.title} 
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 left-3 flex space-x-2">
                      <span className="bg-white/90 backdrop-blur-sm text-indigo-600 px-2 py-1 rounded text-xs font-medium">{itinerary.category}</span>
                      <span className="bg-white/90 backdrop-blur-sm text-gray-700 px-2 py-1 rounded text-xs font-medium flex items-center space-x-1">
                        <Clock size={12} />
                        <span>{itinerary.duration}</span>
                      </span>
                    </div>
                    <button className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white">
                      <Heart size={18} className="text-gray-600 hover:text-red-500" />
                    </button>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Map size={16} className="text-gray-500" />
                      <span className="text-sm text-gray-600">{itinerary.location}</span>
                    </div>
                    <h3 className="font-bold text-lg mb-2 text-gray-900">{itinerary.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{itinerary.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                          <img src="/api/placeholder/32/32" alt="Critic avatar" className="rounded-full" />
                        </div>
                        <span className="text-sm text-gray-700">{itinerary.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star size={16} className="text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{itinerary.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredItineraries.map((itinerary) => (
                <div key={itinerary.id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 flex hover:shadow-md transition cursor-pointer">
                  <div className="w-48 h-full">
                    <img 
                      src={`/api/placeholder/200/200`} 
                      alt={itinerary.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-grow p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-xs font-medium">{itinerary.category}</span>
                        <span className="text-sm text-gray-600 flex items-center">
                          <Map size={14} className="mr-1" />
                          {itinerary.location}
                        </span>
                        <span className="text-sm text-gray-600 flex items-center">
                          <Clock size={14} className="mr-1" />
                          {itinerary.duration}
                        </span>
                      </div>
                      <h3 className="font-bold text-lg mb-2 text-gray-900">{itinerary.title}</h3>
                      <p className="text-gray-600 text-sm mb-2">{itinerary.description}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                          <img src="/api/placeholder/32/32" alt="Critic avatar" className="rounded-full" />
                        </div>
                        <span className="text-sm text-gray-700">{itinerary.author}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Star size={16} className="text-yellow-400 fill-current" />
                          <span className="text-sm font-medium">{itinerary.rating}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <button className="p-1.5 rounded-full hover:bg-gray-100">
                            <Heart size={18} className="text-gray-600 hover:text-red-500" />
                          </button>
                          <button className="p-1.5 rounded-full hover:bg-gray-100">
                            <Share size={18} className="text-gray-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Load More */}
          <div className="flex justify-center mt-8">
            <button className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium px-6 py-2.5 rounded-lg flex items-center space-x-2">
              <span>Load More</span>
              <ChevronDown size={16} />
            </button>
          </div>
        </div>
        
        {/* Critics You Might Like */}
        {activeTab === 'discover' && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Critics You Might Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {critics.map((critic) => (
                <div key={critic.id} className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition">
                  <div className="h-20 w-20 rounded-full bg-gray-200 mb-4 overflow-hidden">
                    <img src="/api/placeholder/80/80" alt={critic.name} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="font-bold text-lg mb-1">{critic.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{critic.specialty}</p>
                  <div className="flex items-center space-x-1 mb-4">
                    <Star size={14} className="text-yellow-400 fill-current" />
                    <span className="text-sm">{critic.rating} · {critic.reviews} reviews</span>
                  </div>
                  <button className="w-full px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition">
                    Follow
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      
    </div>
  );
};

// Sample data
const categories = [
  { id: 'food', name: 'Food & Dining' },
  { id: 'culture', name: 'Culture & Arts' },
  { id: 'adventure', name: 'Adventure' },
  { id: 'nightlife', name: 'Nightlife' }
];

const critics = [
  { id: 1, name: 'Maya Fernandes', specialty: 'Food & Beach Destinations', rating: 4.9, reviews: 124 },
  { id: 2, name: 'Raj Kumar', specialty: 'Adventure & Wildlife', rating: 4.7, reviews: 98 },
  { id: 3, name: 'Sarah Johnson', specialty: 'Cultural Experiences', rating: 4.8, reviews: 156 },
  { id: 4, name: 'Alex Chen', specialty: 'Urban Exploration', rating: 4.6, reviews: 87 }
];

const sampleItineraries = [
  {
    id: 1,
    title: '24 Hours in Goa: Beach Paradise',
    location: 'Goa, India',
    category: 'adventure',
    duration: '24 hours',
    description: 'Experience the perfect day in Goa with this carefully curated itinerary that takes you from sunrise yoga on Palolem Beach to sunset cocktails at Anjuna.',
    author: 'Maya Fernandes',
    rating: 4.8
  },
  {
    id: 2,
    title: 'Mumbai Food Crawl: Street Food Gems',
    location: 'Mumbai, India',
    category: 'food',
    duration: '6 hours',
    description: 'Discover the hidden street food treasures of Mumbai with this expertly crafted food tour covering everything from vada pav to pav bhaji.',
    author: 'Raj Kumar',
    rating: 4.7
  },
  {
    id: 3,
    title: 'Delhi Historical Tour: Monuments & Museums',
    location: 'Delhi, India',
    category: 'culture',
    duration: '2 days',
    description: 'Explore the rich history of Delhi through its monuments, museums and cultural sites with this comprehensive two-day itinerary.',
    author: 'Sarah Johnson',
    rating: 4.9
  },
  {
    id: 4,
    title: 'Bangalore Pub Crawl: Best Craft Breweries',
    location: 'Bangalore, India',
    category: 'nightlife',
    duration: '5 hours',
    description: "Take a tour of Bangalore's thriving craft beer scene with stops at the city's best microbreweries and pubs.",
    author: 'Alex Chen',
    rating: 4.6
  },
  {
    id: 5,
    title: 'Kashmir Valley: Natural Wonders Tour',
    location: 'Kashmir, India',
    category: 'adventure',
    duration: '3 days',
    description: 'Experience the breathtaking natural beauty of Kashmir Valley with this three-day tour of its lakes, gardens, and mountain vistas.',
    author: 'Maya Fernandes',
    rating: 4.9
  },
  {
    id: 6,
    title: 'Jaipur Royal Tour: Palaces & Heritage',
    location: 'Jaipur, India',
    category: 'culture',
    duration: '2 days',
    description: 'Discover the royal heritage of Jaipur with this two-day tour of its magnificent palaces, forts and cultural landmarks.',
    author: 'Raj Kumar',
    rating: 4.7
  },
  {
    id: 7,
    title: 'Kerala Backwaters Cruise',
    location: 'Kerala, India',
    category: 'adventure',
    duration: '1 day',
    description: 'Experience the serene beauty of Kerala\'s backwaters with this day-long houseboat cruise through scenic canals and villages.',
    author: 'Sarah Johnson',
    rating: 4.8
  },
  {
    id: 8,
    title: 'Kolkata Cultural Immersion',
    location: 'Kolkata, India',
    category: 'culture',
    duration: '3 days',
    description: 'Immerse yourself in the rich cultural heritage of Kolkata with this three-day tour covering literature, art, music, and cuisine.',
    author: 'Alex Chen',
    rating: 4.5
  },
  {
    id: 9,
    title: 'Udaipur Romantic Getaway',
    location: 'Udaipur, India',
    category: 'culture',
    duration: '2 days',
    description: 'Experience the romantic city of lakes with this specially curated itinerary for couples featuring palace visits, boat rides, and candlelit dinners.',
    author: 'Maya Fernandes',
    rating: 4.9
  }
];

export default ItinerariesPage;