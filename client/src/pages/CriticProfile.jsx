import React, { useEffect, useState } from 'react';
import { 
  BarChart2, Image, Video, FileText, Send, TrendingUp, Users, Calendar, 
  Award, Settings, LogOut, ChevronDown, MapPin, Clock, Upload, X, Plus
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
      formData.append('duration', duration);
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
    <div className="mt-20 p-6 bg-gray-50 rounded-lg">
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
            <label className="block text-gray-700 font-medium mb-2">Duration *</label>
            <div className="relative">
              <input
                type="text"
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral"
                placeholder="E.g., 2 days, 5 hours"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
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
  const [timeRange, setTimeRange] = useState('7days');
  
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
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="3months">Last 3 Months</option>
            <option value="year">Last Year</option>
          </select>
          <ChevronDown size={18} className="absolute right-3 top-2.5 text-gray-500 pointer-events-none" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Posts', value: analyticsSummary.totalPosts, icon: FileText, color: 'bg-blue-100 text-blue-600' },
          { label: 'Total Views', value: analyticsSummary.totalViews.toLocaleString(), icon: BarChart2, color: 'bg-purple-100 text-purple-600' },
          { label: 'Total Likes', value: analyticsSummary.totalLikes.toLocaleString(), icon: TrendingUp, color: 'bg-coral-100 text-coral' },
          { label: 'Followers', value: analyticsSummary.followersCount.toLocaleString(), growth: analyticsSummary.growthRate, icon: Users, color: 'bg-green-100 text-green-600' },
        ].map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md">
            <div className={`w-12 h-12 rounded-full ${stat.color} flex items-center justify-center mb-4`}>
              <stat.icon size={24} />
            </div>
            <h3 className="text-lg font-medium text-gray-500">{stat.label}</h3>
            <div className="flex items-end">
              <span className="text-2xl font-bold mr-2">{stat.value}</span>
              {stat.growth && (
                <span className="text-green-600 text-sm font-medium">{stat.growth}</span>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
          <h3 className="text-lg font-medium mb-4">Engagement Over Time</h3>
          <div className="h-64">
            {/* In a real implementation, this would be a chart component */}
            <div className="h-full flex items-end">
              {engagementData.map((data, i) => (
                <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                  <div 
                    className="w-8 bg-coral rounded-t-md transition-all hover:bg-coral-dark" 
                    style={{height: `${data.value}%`}}
                  ></div>
                  <span className="text-xs text-gray-600 mt-2">{data.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium mb-4">Audience Demographics</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1 text-sm">
                <span>Age 18-24</span>
                <span>35%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-coral h-2 rounded-full" style={{width: '35%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1 text-sm">
                <span>Age 25-34</span>
                <span>45%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-coral h-2 rounded-full" style={{width: '45%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1 text-sm">
                <span>Age 35-44</span>
                <span>15%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-coral h-2 rounded-full" style={{width: '15%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1 text-sm">
                <span>Age 45+</span>
                <span>5%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-coral h-2 rounded-full" style={{width: '5%'}}></div>
              </div>
            </div>
            
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Gender</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2 rounded bg-gray-100">
                  <div className="text-lg font-bold">58%</div>
                  <div className="text-xs text-gray-500">Female</div>
                </div>
                <div className="p-2 rounded bg-gray-100">
                  <div className="text-lg font-bold">42%</div>
                  <div className="text-xs text-gray-500">Male</div>
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
    <div className="flex h-screen bg-gray-100 ">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 mt-20 overflow-auto p-6">
        {renderActiveTab()}
      </div>
    </div>
  );
}