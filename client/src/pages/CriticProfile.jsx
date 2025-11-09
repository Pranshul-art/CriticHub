import React, { useEffect, useState } from 'react';
import { 
  BarChart2, Image, Video, FileText, Send, TrendingUp, Users, Calendar, 
  Award, Settings, LogOut, ChevronDown, MapPin, Clock, Upload, X, Plus, Save, Loader2, Edit, Camera
} from 'lucide-react';
import axios from 'axios';

import QuickNavigation from '../components2/QuickNavigation';
import Followers from "../components2/criticsProfile/Followers";

// Dummy data for analytics
const analyticsSummary = {
  totalPosts: 48,
  totalViews: 24892,
  totalLikes: 3741,
  totalComments: 892,
  followersCount: 1456,
  growthRate: '+12.5%'
};

const engagementData = [
  { name: 'Mon', value: 65 },
  { name: 'Tue', value: 72 },
  { name: 'Wed', value: 85 },
  { name: 'Thu', value: 78 },
  { name: 'Fri', value: 95 },
  { name: 'Sat', value: 110 },
  { name: 'Sun', value: 104 }
];

const topPerformingPosts = [
  {
    id: 1,
    title: '20 Hours in Goa',
    thumbnail: '/api/placeholder/100/60',
    views: 5240,
    likes: 842,
    comments: 127
  },
  {
    id: 2,
    title: 'Hidden Gems of Mumbai',
    thumbnail: '/api/placeholder/100/60',
    views: 4129,
    likes: 621,
    comments: 89
  },
  {
    id: 3,
    title: 'Avoid These Tourist Traps',
    thumbnail: '/api/placeholder/100/60',
    views: 3854,
    likes: 504,
    comments: 72
  }
];


const Sidebar = ({ activeTab, setActiveTab }) => {
  const [userData, setUserData] = useState({
    username: '',
    tag: 'Critic'
  });
  const [isLoading, setIsLoading] = useState(true);

  const navItems = [
    { icon: FileText, label: 'Create Post', id: 'create' },
    { icon: BarChart2, label: 'Analytics', id: 'analytics' },
    { icon: Users, label: 'Followers', id: 'followers' },
    { icon: Calendar, label: 'Schedule', id: 'schedule' },
    { icon: Award, label: 'Achievements', id: 'achievements' },
    { icon: Settings, label: 'Settings', id: 'settings' }
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('http://localhost:8080/api/v1/user', {
          headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        
        if (response.data && response.data.success) {
          setUserData({
            username: response.data.username || localStorage.getItem('username'),
            tag: response.data.tag || 'CriticHub'
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Get user initials for the avatar
  const getInitials = () => {
    if (!userData.username) return 'U';
    return userData.username.split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const handleLogout = async () => {
    try {
      // You can replace this with your actual logout endpoint
      localStorage.removeItem("username")
      localStorage.removeItem("token");
      // Redirect to login page or home page after logout
      window.location.href = '/';
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  
  return (
    <div className="w-64 mt-20 bg-white shadow-lg flex flex-col">
      <div className="p-6 border-b">
        <div className="flex items-center">
          <div className="h-12 w-12 bg-navy-900 rounded-full mr-3 flex items-center justify-center text-white font-bold">
            {isLoading ? '...' : getInitials()}
          </div>
          <div>
            <h2 className="font-bold">
              {isLoading ? 'Loading...' : userData.username}
            </h2>
            <p className="text-sm text-gray-500">
              {isLoading ? '' : userData.tag}
            </p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map(item => (
            <li key={item.id}>
              <button 
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                  activeTab === item.id 
                    ? 'bg-navy-900 text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon size={18} className="mr-3" />
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t">
        <button 
          onClick={handleLogout}
          className="flex items-center text-gray-700 w-full p-3 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <LogOut size={18} className="mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};




const CreatePostTab = () => {
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [location, setLocation] = useState('');
  const [duration, setDuration] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [uploadedMedia, setUploadedMedia] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch categories when component mounts
  useEffect(() => {
    // Define fetchCategories function within useEffect
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/content/categories',{
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
        });
        if (response.data && response.data.success) {
          setCategories(response.data.data);
          // Set default category if available
          if (response.data.data.length > 0) {
            setCategoryId(response.data.data[0].id);
          }
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Removed duplicate fetchCategories function definition

  const handleAddTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput('');
    }
  };
  
  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleMediaUpload = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      
      // Create preview for the uploaded file
      const preview = {
        id: Date.now(),
        name: file.name,
        type: file.type.includes('video') ? 'video' : 'image',
        url: URL.createObjectURL(file)
      };
      
      setUploadedMedia([...uploadedMedia, preview]);
    }
  };
  
  const handleRemoveMedia = (mediaId) => {
    setUploadedMedia(uploadedMedia.filter(media => media.id !== mediaId));
    // If the removed media is the selected file, reset it
    if (uploadedMedia.length === 1) {
      setSelectedFile(null);
    }
  };

  const resetForm = () => {
    setPostTitle('');
    setPostContent('');
    setLocation('');
    setDuration('');
    setTags([]);
    setTagInput('');
    setUploadedMedia([]);
    setSelectedFile(null);
    setErrorMessage('');
  };

  const handleSubmit = async (isDraft = false) => {
    try {
      setIsLoading(true);
      setErrorMessage('');
      
      // Validate required fields
      if (!postTitle || !postContent || !duration || !categoryId) {
        setErrorMessage('Please fill all required fields');
        setIsLoading(false);
        return;
      }

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('title', postTitle);
      formData.append('content', postContent);
      if (location) formData.append('location', location);
      formData.append('duration', Number(duration));
      formData.append('categoryId', categoryId);
      
      // Add tags
      formData.append('tags', tags.join(','));
      
      // Add media file if selected
      if (selectedFile) {
        formData.append('media', selectedFile);
      }

      // Add draft status if applicable
      if (isDraft) {
        formData.append('status', 'draft');
      }

      // Send request to backend
      const response = await axios.post('http://localhost:8080/api/v1/content/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      if (response.data && response.data.success) {
        setSuccessMessage(response.data.message || 'Itinerary published successfully!');
        resetForm();
      } else {
        setErrorMessage(response.data?.message || 'Failed to publish itinerary');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      setErrorMessage(error.response?.data?.message || 'An error occurred while publishing');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="mt-1 p-6 bg-gray-50 rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Create New Itinerary</h2>
      
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mb-4 rounded">
          {errorMessage}
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 mb-4 rounded">
          {successMessage}
        </div>
      )}
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Itinerary Title *</label>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral"
            placeholder="E.g., 48 Hours in Paris"
            value={postTitle}
            onChange={(e) => setPostTitle(e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Location</label>
            <div className="relative">
              <input
                type="text"
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral"
                placeholder="City, Country"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <MapPin size={18} className="absolute left-3 top-3.5 text-gray-400" />
            </div>
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">Duration (in hours) *</label>
            <div className="relative">
              <input
                type="number"
                min="1"
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral"
                placeholder="E.g., 2"
                value={duration}
                onChange={(e) => setDuration(e.target.value.replace(/[^0-9]/g, ""))}
              />
              <Clock size={18} className="absolute left-3 top-3.5 text-gray-400" />
            </div>
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">Category *</label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Content *</label>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg h-48 focus:outline-none focus:ring-2 focus:ring-coral"
            placeholder="Write your detailed itinerary, recommendations, places to avoid, etc."
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
          ></textarea>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Tags</label>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {tags.map(tag => (
              <div key={tag} className="bg-gray-100 px-3 py-1 rounded-full flex items-center">
                <span className="text-gray-800 mr-1">#{tag}</span>
                <button 
                  type="button"
                  onClick={() => handleRemoveTag(tag)} 
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
          <div className="flex">
            <input
              type="text"
              className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-coral"
              placeholder="Add tags (e.g., food, beaches, budget)"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
            />
            <button 
              type="button"
              onClick={handleAddTag}
              className="bg-navy-900 text-white px-4 rounded-r-lg hover:bg-navy-800"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Upload Media</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-3">
            <input 
              type="file" 
              id="media-upload" 
              className="hidden" 
              accept="image/*,video/*" 
              onChange={handleMediaUpload}
            />
            <label htmlFor="media-upload" className="cursor-pointer">
              <Upload size={36} className="mx-auto mb-2 text-gray-400" />
              <p className="text-gray-600 mb-1">Drag and drop files here or click to browse</p>
              <p className="text-gray-400 text-sm">Accepted formats: JPEG, PNG, MP4, MOV</p>
            </label>
          </div>
          
          {uploadedMedia.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {uploadedMedia.map(media => (
                <div key={media.id} className="relative group">
                  <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden bg-gray-100">
                    <img src={media.url} alt={media.name} className="object-cover w-full h-full" />
                    {media.type === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-black bg-opacity-50 rounded-full p-2">
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                  <button 
                    type="button"
                    onClick={() => handleRemoveMedia(media.id)}
                    className="absolute top-2 right-2 bg-black bg-opacity-60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex justify-end">
          <button 
            type="button"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg mr-3 hover:bg-gray-300 transition-colors"
            onClick={() => handleSubmit(true)}
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save as Draft'}
          </button>
          <button 
            type="button"
            className="px-6 py-2 bg-coral text-white rounded-lg flex items-center hover:bg-coral-dark transition-colors"
            onClick={() => handleSubmit(false)}
            disabled={isLoading}
          >
            {isLoading ? (
              'Publishing...'
            ) : (
              <>
                <Send size={18} className="mr-2" />
                Publish Itinerary
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export { CreatePostTab };



const AnalyticsTab = () => {
  const [timeRange, setTimeRange] = useState('7');
  const [totals, setTotals] = useState({
    totalPosts: 0,
    totalLikes: 0,
    totalFollowers: 0,
    postsGrowth: 0,
    likesGrowth: 0,
    followersGrowth: 0,
  });
  const [demographics, setDemographics] = useState({
    age: { '18-24': 0, '25-34': 0, '35-44': 0, '45+': 0 },
    gender: { male: 0, female: 0, other: 0 }
  });
  const [engagement, setEngagement] = useState([
    { name: 'Sunday', likes: 0, comments: 0 },
    { name: 'Monday', likes: 0, comments: 0 },
    { name: 'Tuesday', likes: 0, comments: 0 },
    { name: 'Wednesday', likes: 0, comments: 0 },
    { name: 'Thursday', likes: 0, comments: 0 },
    { name: 'Friday', likes: 0, comments: 0 },
    { name: 'Saturday', likes: 0, comments: 0 },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        // Fetch totals
        const totalsRes = await axios.get('http://localhost:8080/api/v1/analytics/totals', {
          params: {
            // userId: localStorage.getItem("userId"),
            days: timeRange
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (totalsRes.data && totalsRes.data.success) {
          setTotals(totalsRes.data.data);
        }
        // Fetch demographics
        const demoRes = await axios.get('http://localhost:8080/api/v1/analytics/demographics', {
          params: {
            // userId: localStorage.getItem("userId"),
            days: timeRange
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (demoRes.data && demoRes.data.success) {
          setDemographics(demoRes.data.data);
        }
        // Fetch engagement (daily interactions)
        const engagementRes = await axios.get('http://localhost:8080/api/v1/analytics/daily-interactions', {
          params: {
            // userId: localStorage.getItem("userId"),
            weeks: Math.ceil(Number(timeRange) / 7)
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (engagementRes.data && engagementRes.data.success) {
          // Convert backend object to array for chart
          const daysOrder = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
          const engagementArr = daysOrder.map(day => ({
            name: day,
            likes: engagementRes.data.data[day]?.likes || 0,
            comments: engagementRes.data.data[day]?.comments || 0,
          }));
          setEngagement(engagementArr);
        }
      } catch (err) {
        // Optionally handle error
      }
      setLoading(false);
    };
    fetchAnalytics();
  }, [timeRange]);

  return (
    <div className="p-6 mt-20 bg-gray-50 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Content Analytics</h2>
        <div className="relative">
          <select
            className="appearance-none bg-white border border-gray-300 px-4 py-2 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 3 Months</option>
            <option value="365">Last Year</option>
          </select>
          <ChevronDown size={18} className="absolute right-3 top-2.5 text-gray-500 pointer-events-none" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {loading ? (
          <div className="col-span-4 text-center">Loading...</div>
        ) : (
          [
            {
              label: 'Total Posts',
              value: totals.totalPosts,
              growth: totals.postsGrowth,
              icon: FileText,
              color: 'bg-blue-100 text-blue-600',
            },
            {
              label: 'Total Likes',
              value: totals.totalLikes,
              growth: totals.likesGrowth,
              icon: TrendingUp,
              color: 'bg-light-cream text-coral-500',
            },
            {
              label: 'Followers',
              value: totals.totalFollowers,
              growth: totals.followersGrowth,
              icon: Users,
              color: 'bg-green-100 text-green-600',
            },
          ].map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <div className={`w-12 h-12 rounded-full ${stat.color} flex items-center justify-center mb-4`}>
                <stat.icon size={24} />
              </div>
              <h3 className="text-lg font-medium text-gray-500">{stat.label}</h3>
              <div className="flex items-end">
                <span className="text-2xl font-bold mr-2">{stat.value}</span>
                <span className={`text-sm font-medium ${stat.growth > 0 ? "text-green-600" : stat.growth < 0 ? "text-red-600" : "text-gray-500"}`}>
                  {stat.growth > 0 ? `+${stat.growth}` : stat.growth}
                  {stat.growth !== 0 && ` in last ${timeRange === "7" ? "week" : timeRange === "30" ? "month" : timeRange === "90" ? "3 months" : "year"}`}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
          <h3 className="text-lg font-medium mb-4">Engagement Over Time</h3>
          <div className="h-64">
            {/* Likes and Comments Bar Chart */}
            <div className="h-full flex items-end">
              {engagement.map((data, i) => (
                <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                  <div
                    className="w-8 bg-coral rounded-t-md transition-all hover:bg-coral-dark mb-1"
                    style={{ height: `${Math.min(data.likes, 120)}px` }}
                    title={`Likes: ${data.likes}`}
                  ></div>
                  <div
                    className="w-8 bg-blue-300 rounded-t-md transition-all hover:bg-blue-400"
                    style={{ height: `${Math.min(data.comments, 120)}px` }}
                    title={`Comments: ${data.comments}`}
                  ></div>
                  <span className="text-xs text-gray-600 mt-2">{data.name.slice(0, 3)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium mb-4">Audience Demographics</h3>
          <div className="space-y-4">
            {/* Age Groups */}
            {Object.entries(demographics.age).map(([age, percent]) => (
              <div key={age}>
                <div className="flex justify-between mb-1 text-sm">
                  <span>Age {age}</span>
                  <span>{Math.round(percent * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-coral h-2 rounded-full" style={{ width: `${Math.round(percent * 100)}%` }}></div>
                </div>
              </div>
            ))}
            {/* Gender */}
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Gender</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2 rounded bg-gray-100">
                  <div className="text-lg font-bold">{Math.round(demographics.gender.female * 100)}%</div>
                  <div className="text-xs text-gray-500">Female</div>
                </div>
                <div className="p-2 rounded bg-gray-100">
                  <div className="text-lg font-bold">{Math.round(demographics.gender.male * 100)}%</div>
                  <div className="text-xs text-gray-500">Male</div>
                </div>
                <div className="p-2 rounded bg-gray-100 col-span-2">
                  <div className="text-lg font-bold">{Math.round(demographics.gender.other * 100)}%</div>
                  <div className="text-xs text-gray-500">Other</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-medium mb-4">Top Performing Posts</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-3">Post</th>
                <th className="pb-3">Views</th>
                <th className="pb-3">Likes</th>
                <th className="pb-3">Comments</th>
                <th className="pb-3">Conversion Rate</th>
              </tr>
            </thead>
            <tbody>
              {topPerformingPosts.map((post) => (
                <tr key={post.id} className="border-b">
                  <td className="py-4 pr-4">
                    <div className="flex items-center">
                      <div className="w-16 h-10 rounded overflow-hidden bg-gray-100 mr-3">
                        <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover" />
                      </div>
                      <span className="font-medium">{post.title}</span>
                    </div>
                  </td>
                  <td className="py-4">{post.views.toLocaleString()}</td>
                  <td className="py-4">{post.likes.toLocaleString()}</td>
                  <td className="py-4">{post.comments.toLocaleString()}</td>
                  <td className="py-4">
                    <div className="flex items-center">
                      <span className="font-medium mr-2">{Math.round((post.likes / post.views) * 100)}%</span>
                      <div className="w-24 bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-coral h-1.5 rounded-full" 
                          style={{width: `${Math.round((post.likes / post.views) * 100)}%`}}
                        ></div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const SettingsTab = () => {
  const [profile, setProfile] = useState({
    username: '',
    tag: '',
    age: '',
    gender: '',
    bio: '',
    profileImage: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [typedUsername, setTypedUsername] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get('http://localhost:8080/api/v1/user/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        if (res.data && res.data.success) {
          setProfile({
            username: res.data.data.username || '',
            tag: res.data.data.tag || '',
            age: res.data.data.age || '',
            gender: res.data.data.gender || '',
            bio: res.data.data.bio || '',
            profileImage: res.data.data.profileImage || '',
          });
          setPreviewImage(res.data.data.profileImage || '');
        }
      } catch (err) {
        setError('Failed to load profile info.');
      }
      setIsLoading(false);
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    if (!editing && profile.username) {
      setTypedUsername('');
      let i = 0;
      const interval = setInterval(() => {
        setTypedUsername(profile.username.slice(0, i + 1));
        i++;
        if (i === profile.username.length) clearInterval(interval);
      }, 90); // Adjust speed as needed
      return () => clearInterval(interval);
    }
  }, [profile.username, editing]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreviewImage(URL.createObjectURL(file));
    setProfile((prev) => ({ ...prev, profileImage: file }));
  };

  const handleEdit = () => {
    setEditing(true);
    setSuccess('');
    setError('');
  };

  const handleCancel = () => {
    setEditing(false);
    setSuccess('');
    setError('');
    setPreviewImage(profile.profileImage || '');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      let imageUrl = profile.profileImage;
      // If a new image file is selected, upload it
      if (profile.profileImage instanceof File) {
        const formData = new FormData();
        formData.append('profileImage', profile.profileImage);
        const imgRes = await axios.put('http://localhost:8080/api/v1/user/profile', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        if (imgRes.data && imgRes.data.success) {
          imageUrl = imgRes.data.data?.profileImage || imageUrl;
        }
      }
      // Update other fields
      const res = await axios.put('http://localhost:8080/api/v1/user/profile', {
        username: profile.username,
        tag: profile.tag,
        age: profile.age,
        gender: profile.gender,
        bio: profile.bio,
        profileImage: imageUrl,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.data && res.data.success) {
        setSuccess('Profile updated!');
        setEditing(false);
        setProfile((prev) => ({
          ...prev,
          profileImage: imageUrl,
        }));
      } else {
        setError('Failed to update profile.');
      }
    } catch {
      setError('Failed to update profile.');
    }
    setSaving(false);
  };

  if (isLoading) {
    return <div className="text-center py-10 text-navy-700 dark:text-cream">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <div className="relative  bg-gradient-to-r from-coral to-pink-400 rounded-3xl shadow-xl overflow-visible mb-8">
        {/* Cover image effect */}
        <div className="overflow-visible h-32 w-full bg-gradient-to-r from-coral to-pink-400 relative flex items-center justify-center">
          <svg
            className="handwriting-svg"
            width="100%"
            height="200"
            viewBox="0 0 600 80"
            style={{ maxWidth: '95%' }}
          >
            <text
              x="45%"
              y="60"
              textAnchor="middle"
              style={{
                fontFamily: "'Mrs Saint Delafield', cursive",
                fontSize: "9rem",
                fill: "none",
                stroke: "white",
                strokeWidth: 2,
              }}
            >
              {profile.username}
            </text>
          </svg>
        </div>
        {/* Avatar */}
        <div className="absolute left-1/2 -bottom-16 transform -translate-x-1/2 z-20">
          <div className="relative">
            <img
              src={previewImage || '/default-avatar.png'}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover bg-white"
            />
            {editing && (
              <label className="absolute bottom-2 right-2 bg-coral p-2 rounded-full cursor-pointer shadow-lg hover:bg-coral-dark transition-colors z-30">
                <Camera size={18} className="text-white" />
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            )}
          </div>
        </div>
        {/* Edit button */}
        {!editing && (
          <button
            onClick={handleEdit}
            className="absolute top-4 right-4 bg-white text-coral px-4 py-2 rounded-lg shadow hover:bg-coral hover:text-white transition-colors flex items-center z-30"
          >
            <Edit size={18} className="mr-2" /> Edit
          </button>
        )}
        {/* Add extra space below for avatar */}
        <div className="h-20"></div>
      </div>

      <div className="bg-white dark:bg-navy-900 rounded-3xl shadow-lg pt-20 pb-10 px-8">
        {success && <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4">{success}</div>}
        {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{error}</div>}

        <form onSubmit={handleSave}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-gray-700 dark:text-cream font-medium mb-1">Username</label>
              <input
                type="text"
                name="username"
                value={profile.username}
                onChange={handleChange}
                disabled={!editing}
                className={`w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral bg-gray-50 dark:bg-navy-800 dark:border-navy-700 dark:text-cream ${!editing ? 'cursor-default' : ''}`}
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-cream font-medium mb-1">Tag</label>
              <input
                type="text"
                name="tag"
                value={profile.tag}
                onChange={handleChange}
                disabled={!editing}
                className={`w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral bg-gray-50 dark:bg-navy-800 dark:border-navy-700 dark:text-cream ${!editing ? 'cursor-default' : ''}`}
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-cream font-medium mb-1">Age</label>
              <input
                type="number"
                name="age"
                value={profile.age}
                onChange={handleChange}
                disabled={!editing}
                className={`w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral bg-gray-50 dark:bg-navy-800 dark:border-navy-700 dark:text-cream ${!editing ? 'cursor-default' : ''}`}
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-cream font-medium mb-1">Gender</label>
              <select
                name="gender"
                value={profile.gender}
                onChange={handleChange}
                disabled={!editing}
                className={`w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral bg-gray-50 dark:bg-navy-800 dark:border-navy-700 dark:text-cream ${!editing ? 'cursor-default' : ''}`}
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div className="mt-8">
            <label className="block text-gray-700 dark:text-cream font-medium mb-1">Bio</label>
            <textarea
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              disabled={!editing}
              className={`w-full p-3 border border-gray-300 rounded-lg h-24 focus:outline-none focus:ring-2 focus:ring-coral bg-gray-50 dark:bg-navy-800 dark:border-navy-700 dark:text-cream ${!editing ? 'cursor-default' : ''}`}
              placeholder="Share your story, your passion, or your favorite travel quote!"
            />
          </div>
          {editing && (
            <div className="flex gap-4 justify-end mt-8">
              <button
                type="submit"
                className="bg-coral text-white px-6 py-2 rounded-lg flex items-center hover:bg-coral-dark transition-colors shadow"
                disabled={saving}
              >
                {saving ? <Loader2 className="animate-spin mr-2" size={18} /> : <Save className="mr-2" size={18} />}
                Save
              </button>
              <button
                type="button"
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg flex items-center hover:bg-gray-300 transition-colors shadow"
                onClick={handleCancel}
                disabled={saving}
              >
                <X className="mr-2" size={18} /> Cancel
              </button>
            </div>
          )}
        </form>
        {/* Bio as a quote */}
        {!editing && profile.bio && (
          <div className="mt-10 text-center">
            <blockquote className="italic text-coral text-lg border-l-4 border-coral-400 pl-4">
              “{profile.bio}”
            </blockquote>
          </div>
        )}
      </div>
    </div>
  );
};

export default function CriticDashboard() {
  const [activeTab, setActiveTab] = useState('create');
  
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'create':
        return <CreatePostTab />;
      case 'analytics':
        return <AnalyticsTab />;
      case "followers":
        return <Followers />;
      case "settings":
        return <SettingsTab />;
      default:
        return (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-xl font-medium text-gray-700 mb-2">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h3>
              <p className="text-gray-500">This section is under development</p>
            </div>
          </div>
        );
    }
  };
  
  return (
    <div className="flex h-screen bg-purple-300 ">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 mt-20 overflow-auto p-6">
        {renderActiveTab()}
      </div>
    </div>
  );
}