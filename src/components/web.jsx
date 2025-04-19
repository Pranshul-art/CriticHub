// App.js - Main Application Component
import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LoadingSpinner from './components/ui/LoadingSpinner';

// Lazy-loaded components for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const CriticProfile = lazy(() => import('./pages/CriticProfile'));
const DetailPage = lazy(() => import('./pages/DetailPage'));
const ItineraryBuilder = lazy(() => import('./pages/ItineraryBuilder'));
const EducationExplorer = lazy(() => import('./pages/EducationExplorer'));
const CreationStudio = lazy(() => import('./pages/CreationStudio'));

function App() {
  const [darkMode, setDarkMode] = useState(false);
  
  // Check user preference for dark mode
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const storedPreference = localStorage.getItem('darkMode');
    
    if (storedPreference !== null) {
      setDarkMode(storedPreference === 'true');
    } else {
      setDarkMode(prefersDark);
    }
  }, []);
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode.toString());
  };

  return (
    <Router>
      <div className={`${darkMode ? 'dark' : ''} min-h-screen transition-colors duration-300`}>
        <div className="bg-cream dark:bg-navy-900 text-navy-900 dark:text-cream min-h-screen">
          <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/critic/:id" element={<CriticProfile />} />
              <Route path="/detail/:type/:id" element={<DetailPage />} />
              <Route path="/itinerary" element={<ItineraryBuilder />} />
              <Route path="/education" element={<EducationExplorer />} />
              <Route path="/create" element={<CreationStudio />} />
            </Routes>
          </Suspense>
          <Footer />
        </div>
      </div>
    </Router>
  );
}

export default App;

// HomePage.jsx - Main landing page with innovative features
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import CategoryNav from '../components/home/CategoryNav';
import FeaturedCritiques from '../components/home/FeaturedCritiques';
import TrendingSection from '../components/home/TrendingSection';
import PersonalizedFeed from '../components/home/PersonalizedFeed';
import SearchOverlay from '../components/search/SearchOverlay';
import MoodSelector from '../components/home/MoodSelector';

const HomePage = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [currentMood, setCurrentMood] = useState('discover');
  const [greeting, setGreeting] = useState('');
  const globeContainerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const globeRef = useRef(null);
  
  // Set personalized greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    let newGreeting = '';
    
    if (hour >= 5 && hour < 12) {
      newGreeting = 'Good morning';
    } else if (hour >= 12 && hour < 18) {
      newGreeting = 'Good afternoon';
    } else {
      newGreeting = 'Good evening';
    }
    
    // Add personalized context
    const day = new Date().getDay();
    const isWeekend = day === 0 || day === 6;
    
    if (isWeekend) {
      newGreeting += ', planning your weekend?';
    } else if (hour >= 17) {
      newGreeting += ', exploring evening plans?';
    } else {
      newGreeting += ', what are you exploring today?';
    }
    
    setGreeting(newGreeting);
  }, []);
  
  // Initialize Three.js globe
  useEffect(() => {
    if (!globeContainerRef.current) return;
    
    // Setup
    const container = globeContainerRef.current;
    
    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;
    
    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Create globe
    const sphereGeometry = new THREE.SphereGeometry(2, 50, 50);
    const loader = new THREE.TextureLoader();
    
    // Use a combination of textures for a striking globe
    loader.load('/assets/earth_texture.jpg', (texture) => {
      const sphereMaterial = new THREE.MeshPhongMaterial({
        map: texture,
        bumpScale: 0.05,
        transparent: true,
        opacity: 0.9,
      });
      
      const globe = new THREE.Mesh(sphereGeometry, sphereMaterial);
      scene.add(globe);
      globeRef.current = globe;
      
      // Add a subtle glow effect
      const glowMaterial = new THREE.ShaderMaterial({
        uniforms: {
          c: { type: "f", value: 0.5 },
          p: { type: "f", value: 4.5 },
          glowColor: { type: "c", value: new THREE.Color(0x00c2a8) },
          viewVector: { type: "v3", value: camera.position }
        },
        vertexShader: `
          uniform vec3 viewVector;
          varying float intensity;
          void main() {
            vec3 vNormal = normalize(normalMatrix * normal);
            vec3 vNormel = normalize(normalMatrix * viewVector);
            intensity = pow(0.7 - dot(vNormal, vNormel), 1.5);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 glowColor;
          varying float intensity;
          void main() {
            vec3 glow = glowColor * intensity;
            gl_FragColor = vec4(glow, 1.0);
          }
        `,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true
      });
      
      const glowSphere = new THREE.Mesh(
        new THREE.SphereGeometry(2.2, 50, 50),
        glowMaterial
      );
      scene.add(glowSphere);
    });
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);
    
    // Add controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.rotateSpeed = 0.5;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (rendererRef.current && rendererRef.current.domElement) {
        container.removeChild(rendererRef.current.domElement);
      }
    };
  }, []);
  
  // Add hotspots to globe for trending locations
  const addHotspots = (locations) => {
    if (!sceneRef.current || !globeRef.current) return;
    
    locations.forEach((location) => {
      // Convert lat/long to 3D position
      const phi = (90 - location.lat) * (Math.PI / 180);
      const theta = (location.lng + 180) * (Math.PI / 180);
      
      const x = -2 * Math.sin(phi) * Math.cos(theta);
      const y = 2 * Math.cos(phi);
      const z = 2 * Math.sin(phi) * Math.sin(theta);
      
      // Create hotspot
      const geometry = new THREE.SphereGeometry(0.05, 16, 16);
      const material = new THREE.MeshBasicMaterial({
        color: location.intensity > 0.7 ? 0xff5e5b : 0x00c2a8,
        transparent: true,
        opacity: 0.8
      });
      
      const hotspot = new THREE.Mesh(geometry, material);
      hotspot.position.set(x, y, z);
      sceneRef.current.add(hotspot);
      
      // Add pulsing animation
      const pulseAnimation = () => {
        const scale = 1 + 0.2 * Math.sin(Date.now() * 0.005 * location.intensity);
        hotspot.scale.set(scale, scale, scale);
        requestAnimationFrame(pulseAnimation);
      };
      
      pulseAnimation();
    });
  };
  
  // Mock trending locations data
  useEffect(() => {
    const trendingLocations = [
      { lat: 40.7128, lng: -74.006, intensity: 0.9 }, // New York
      { lat: 51.5074, lng: -0.1278, intensity: 0.8 }, // London
      { lat: 35.6762, lng: 139.6503, intensity: 0.7 }, // Tokyo
      { lat: -33.8688, lng: 151.2093, intensity: 0.6 }, // Sydney
      { lat: 19.4326, lng: -99.1332, intensity: 0.8 }, // Mexico City
      { lat: -22.9068, lng: -43.1729, intensity: 0.7 }, // Rio
      { lat: 15.3, lng: 75.713, intensity: 0.9 }, // Goa, India
    ];
    
    addHotspots(trendingLocations);
  }, []);

  return (
    <div className="relative">
      {/* Hero Section with 3D Globe */}
      <section className="relative h-screen max-h-[800px] overflow-hidden bg-gradient-to-b from-cream to-light-cream dark:from-navy-900 dark:to-navy-800">
        {/* Globe Container */}
        <div 
          ref={globeContainerRef}
          className="absolute inset-0 opacity-80"
        />
        
        {/* Hero Content */}
        <div className="container mx-auto h-full flex flex-col justify-center items-center relative z-10 px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl"
          >
            <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 text-navy-900 dark:text-cream">
              <span className="text-coral">Discover</span> What Matters
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-navy-700 dark:text-cream opacity-90">
              {greeting}
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <button 
                className="w-full flex items-center justify-between bg-white dark:bg-navy-800 rounded-xl px-6 py-4 shadow-lg hover:shadow-xl transition-all duration-300 text-left"
                onClick={() => setShowSearch(true)}
              >
                <span className="text-gray-500 dark:text-gray-300">Search experiences, places, schools...</span>
                <div className="bg-coral-500 text-white rounded-lg p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </button>
            </div>
          </motion.div>
          
          {/* Mood Selector */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="absolute bottom-8 left-0 right-0"
          >
            <MoodSelector currentMood={currentMood} setCurrentMood={setCurrentMood} />
          </motion.div>
        </div>
      </section>

      {/* Categories Navigation */}
      <CategoryNav />
      
      {/* Featured Critiques */}
      <section className="py-12 md:py-20 bg-white dark:bg-navy-800">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-navy-900 dark:text-cream">Featured Critiques</h2>
            <button className="text-coral-500 hover:text-coral-600 dark:hover:text-coral-400 font-medium flex items-center gap-2 transition-colors">
              View all
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          <FeaturedCritiques mood={currentMood} />
        </div>
      </section>
      
      {/* Trending Now */}
      <section className="py-12 md:py-20 bg-light-cream dark:bg-navy-900">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-navy-900 dark:text-cream">Trending Now</h2>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 rounded-full bg-coral-500 text-white hover:bg-coral-600 transition-colors">Today</button>
              <button className="px-4 py-2 rounded-full text-navy-600 hover:bg-white dark:text-cream dark:hover:bg-navy-800 transition-colors">This Week</button>
              <button className="px-4 py-2 rounded-full text-navy-600 hover:bg-white dark:text-cream dark:hover:bg-navy-800 transition-colors">This Month</button>
            </div>
          </div>
          
          <TrendingSection />
        </div>
      </section>
      
      {/* Personalized Feed */}
      <section className="py-12 md:py-20 bg-white dark:bg-navy-800">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-navy-900 dark:text-cream">For You</h2>
            <button className="text-coral-500 hover:text-coral-600 dark:hover:text-coral-400 font-medium flex items-center gap-2 transition-colors">
              Adjust preferences
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          <PersonalizedFeed />
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-coral-500 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">Become a Critic</h2>
            <p className="text-xl mb-8 opacity-90">Share your unique perspective and help others discover what truly matters.</p>
            <button className="bg-white text-coral-500 font-bold text-lg px-8 py-4 rounded-xl hover:bg-navy-900 hover:text-white transition-colors shadow-lg">
              Start Creating
            </button>
          </div>
        </div>
      </section>
      
      {/* Search Overlay */}
      {showSearch && (
        <SearchOverlay onClose={() => setShowSearch(false)} />
      )}
    </div>
  );
};

export default HomePage;

// components/home/CategoryNav.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const categories = [
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
  }
];

const CategoryNav = () => {
  return (
    <section className="sticky top-20 z-30 bg-cream dark:bg-navy-900 shadow-md">
      <div className="container mx-auto px-4">
        <div className="py-3 overflow-x-auto hide-scrollbar">
          <div className="flex items-center gap-4">
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

// components/home/FeaturedCritiques.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Mock data for featured critiques
const critiques = [
  {
    id: 1,
    title: "The Hidden Beaches of Goa",
    type: "place",
    category: "travel",
    image: "/api/placeholder/600/400",
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
    image: "/api/placeholder/600/400",
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
    image: "/api/placeholder/600/400",
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
    image: "/api/placeholder/600/400",
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
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-coral" viewBox="0 0 20 20" fill="currentColor">
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

// components/home/TrendingSection.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Mock data for trending items
const trendingItems = [
{
  id: 1,
  title: "The Truth About NYU's Film School",
  type: "education",
  category: "education",
  image: "/api/placeholder/600/400",
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
  image: "/api/placeholder/600/400",
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
  image: "/api/placeholder/600/400",
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
            
            <div className="flex items-center gap-1 text-coral">
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

// components/home/PersonalizedFeed.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Mock data for personalized recommendations
const personalizedItems = [
{
  id: 1,
  title: "The Campus Housing They Don't Show on Tours",
  type: "education",
  category: "education",
  image: "/api/placeholder/600/400",
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
  image: "/api/placeholder/600/400",
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
  image: "/api/placeholder/600/400",
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
  image: "/api/placeholder/600/400",
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

// components/home/MoodSelector.jsx
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

// components/search/SearchOverlay.jsx
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
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-coral" viewBox="0 0 20 20" fill="currentColor">
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

// components/home/Hero.jsx
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const Hero = ({ onOpenSearch }) => {
  const globeRef = useRef(null);
  
  // Get time of day to customize greeting
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Globe visualization with Three.js
  useEffect(() => {
    if (!globeRef.current) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, globeRef.current.clientWidth / globeRef.current.clientHeight, 0.1, 1000);
    camera.position.z = 200;
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(globeRef.current.clientWidth, globeRef.current.clientHeight);
    globeRef.current.appendChild(renderer.domElement);
    
    // Globe creation
    const sphereGeometry = new THREE.SphereGeometry(80, 64, 64);
    const loader = new THREE.TextureLoader();
    
    // Earth material with bump mapping for terrain
    const sphereMaterial = new THREE.MeshPhongMaterial({
      map: loader.load('/api/placeholder/1024/512'),
      bumpMap: loader.load('/api/placeholder/1024/512'),
      bumpScale: 0.5,
      specular: new THREE.Color('#444444'),
      shininess: 5,
      transparent: true,
      opacity: 0.9
    });
    
    const globe = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(globe);
    
    // Atmosphere glow effect
    const atmosphereGeometry = new THREE.SphereGeometry(82, 64, 64);
    const atmosphereMaterial = new THREE.MeshPhongMaterial({
      color: 0x0066ff,
      side: THREE.BackSide,
      transparent: true,
      opacity: 0.2
    });
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphere);
    
    // Add heat map points for trending locations (simplified)
    const trendingLocations = [
      { lat: 19.0760, lng: 72.8777, intensity: 0.9 },  // Mumbai
      { lat: 40.7128, lng: -74.0060, intensity: 0.8 }, // New York
      { lat: 35.6762, lng: 139.6503, intensity: 0.7 }, // Tokyo
      { lat: 51.5074, lng: -0.1278, intensity: 0.8 },  // London
      { lat: 15.4909, lng: 73.8278, intensity: 1.0 },  // Goa
      { lat: -33.8688, lng: 151.2093, intensity: 0.6 } // Sydney
    ];
    
    // Convert lat/lng to 3D points and add markers
    trendingLocations.forEach(location => {
      // Convert lat/lng to 3D position
      const phi = (90 - location.lat) * (Math.PI / 180);
      const theta = (location.lng + 180) * (Math.PI / 180);
      const radius = 81;
      
      const x = -radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.cos(phi);
      const z = radius * Math.sin(phi) * Math.sin(theta);
      
      // Create heat point
      const pointGeometry = new THREE.SphereGeometry(1 + location.intensity * 2, 16, 16);
      const pointMaterial = new THREE.MeshBasicMaterial({ 
        color: new THREE.Color(`hsl(${15 + location.intensity * 15}, 100%, 50%)`),
        transparent: true,
        opacity: 0.8
      });
      const point = new THREE.Mesh(pointGeometry, pointMaterial);
      point.position.set(x, y, z);
      scene.add(point);
      
      // Add pulsing animation (simplified)
      const pulseGeometry = new THREE.SphereGeometry(1, 16, 16);
      const pulseMaterial = new THREE.MeshBasicMaterial({ 
        color: new THREE.Color(`hsl(${15 + location.intensity * 15}, 100%, 50%)`),
        transparent: true,
        opacity: 0.4
      });
      const pulse = new THREE.Mesh(pulseGeometry, pulseMaterial);
      pulse.position.set(x, y, z);
      scene.add(pulse);
      
      // Store initial scale for animation
      pulse.userData = { baseScale: 1, intensity: location.intensity };
    });
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;
    controls.enableZoom = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Animate pulse points
      scene.children.forEach(child => {
        if (child.userData && child.userData.hasOwnProperty('baseScale')) {
          const scale = child.userData.baseScale + Math.sin(Date.now() * 0.005) * child.userData.intensity * 2;
          child.scale.set(scale, scale, scale);
          child.material.opacity = Math.max(0.1, 0.5 - (scale - child.userData.baseScale) * 0.2);
        }
      });
      
      controls.update();
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle resize
    const handleResize = () => {
      if (!globeRef.current) return;
      camera.aspect = globeRef.current.clientWidth / globeRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(globeRef.current.clientWidth, globeRef.current.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (globeRef.current) {
        globeRef.current.removeChild(renderer.domElement);
      }
      scene.dispose();
    };
  }, []);

  return (
    <div className="relative h-screen min-h-[600px] flex items-center overflow-hidden">
      {/* Background with subtle pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-light-cream to-white dark:from-navy-900 dark:to-navy-800 opacity-90"></div>
      <div className="absolute inset-0 bg-[url('/api/placeholder/500/500')] bg-repeat opacity-5"></div>
      
      <div className="container mx-auto px-4 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span className="text-coral-500 font-medium text-lg">{getTimeBasedGreeting()}</span>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mt-2 mb-6 text-navy-900 dark:text-cream">
                Discover experiences through <span className="text-coral">honest</span> critics
              </h1>
              <p className="text-navy-700 dark:text-gray-300 text-lg mb-8 max-w-lg">
                Explore places, schools, and experiences through the eyes of trusted critics who've been there and done that.
              </p>
              
              {/* Search bar */}
              <div 
                className="bg-white dark:bg-navy-800 rounded-full flex items-center p-2 shadow-lg cursor-pointer"
                onClick={onOpenSearch}
              >
                <div className="bg-coral-500 rounded-full p-2 mx-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <span className="text-gray-500 dark:text-gray-400 flex-grow">Search places, schools, experiences...</span>
                <div className="hidden md:flex items-center gap-2 bg-light-cream dark:bg-navy-700 rounded-full px-3 py-1 mx-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-navy-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  <span className="text-sm text-navy-700 dark:text-gray-300">Near me</span>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Globe visualization */}
          <div className="hidden lg:block">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="relative h-[500px] w-full"
            >
              <div ref={globeRef} className="absolute inset-0"></div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Wave decoration bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" fill="none" className="w-full h-auto">
          <path fillRule="evenodd" clipRule="evenodd" d="M0 80L48 73.3C96 66.7 192 53.3 288 53.3C384 53.3 480 66.7 576 66.7C672 66.7 768 53.3 864 40C960 26.7 1056 13.3 1152 20C1248 26.7 1344 53.3 1392 66.7L1440 80V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0V80Z" fill="currentColor" className="text-white dark:text-navy-800"/>
        </svg>
      </div>
    </div>
  );
};

export default Hero;

// components/home/QuickNavigation.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const categories = [
  {
    id: 'food',
    name: 'Food & Dining',
    icon: 'M8.51 12.48L7.53 9.51C7.44 9.24 7.59 8.96 7.86 8.87C8.12 8.79 8.4 8.93 8.49 9.2L9.47 12.17C9.56 12.44 9.41 12.72 9.14 12.81C8.88 12.9 8.6 12.75 8.51 12.48ZM10.22 9.18C10.38 8.65 10.81 8.24 11.35 8.11C12.95 7.74 14.8 8.34 15.56 9.6C16.32 10.86 16.27 12.76 15.02 13.88C14.9 14.39 14.61 14.83 14.25 15.18C14.39 15.4 14.47 15.64 14.47 15.9C14.47 16.5 14.14 17.05 13.64 17.37V20.25H13.64C13.64 20.66 13.31 21 12.89 21H12.14C11.73 21 11.39 20.66 11.39 20.25V17.96C10.14 17.84 9.14 17.14 8.14 16.08L8.14 16.08C7.87 15.79 7.88 15.34 8.17 15.08C8.45 14.81 8.9 14.82 9.17 15.11C10.13 16.14 11.05 16.73 12.02 16.54C12.03 16.53 12.04 16.53 12.05 16.53C12.26 16.5 12.42 16.36 12.5 16.18C12.59 15.98 12.57 15.71 12.22 15.49C12.17 15.47 12.13 15.44 12.09 15.4C10.63 14.35 10.23 12.24 10.73 10.52C10.52 10.77 10.39 11.08 10.32 11.43L9.95 13.03C9.89 13.27 9.69 13.44 9.45 13.44H7.9C7.45 13.44 7.08 13.8 7.08 14.25C7.08 14.25 7.08 14.25 7.08 14.25V20.25C7.08 20.66 6.74 21 6.33 21H5.58C5.16 21 4.83 20.66 4.83 20.25V11.25L4.83 11.25C4.83 10.81 4.65 10.39 4.34 10.07L3.72 9.46C3.5 9.23 3.5 8.89 3.72 8.67L4.3 8.09C4.72 7.67 5.31 7.47 5.9 7.53C6.5 7.59 7.03 7.9 7.35 8.38C7.47 8.55 7.45 8.78 7.31 8.93L6.74 9.5C6.74 9.5 6.74 9.5 6.74 9.5C6.61 9.63 6.61 9.84 6.74 9.97C6.87 10.1 7.08 10.1 7.21 9.97C7.21 9.97 7.21 9.97 7.21 9.97L7.85 9.34C8.39 8.79 9.06 8.46 9.76 8.36C9.91 8.62 10.08 8.89 10.22 9.18Z',
    activityLevel: 0.9,
    backgroundColor: 'bg-amber-100 dark:bg-amber-900/30',
    iconColor: 'text-amber-600 dark:text-amber-400'
  },
  {
    id: 'travel',
    name: 'Travel',
    icon: 'M12.75 3.03v.41c0 .39.31.72.7.72.39 0 .7-.33.7-.72v-.41c0-1.25-.64-1.97-1.25-2.47-.31-.25-.77-.25-1.08 0-.63.5-1.26 1.22-1.26 2.47v.41c0 .39.32.72.71.72.39 0 .7-.33.7-.72v-.41c0-.58.29-.99.74-1.37.03-.02.06-.03.08-.04h.01c.03.02.05.03.08.04.45.38.74.79.74 1.37zM11.79 4.98c.9 0 3.97 0 4.86 0 .57 0 .74.61.34.92-.02.01-1.66 1.01-1.66 1.01h-2.22c-.01 0-.02 0-.04-.01-.14-.04-2.94-.93-2.94-.93-.41-.12-.31-.99.19-.99h1.47zM15.51 8.9h-6.97c-1.62 0-2.5.71-2.5 2.19v9.15c0 .84.5 1.26 1.23 1.26.74 0 1.24-.42 1.24-1.26v-7.42c0-.76.22-.98.98-.98h5.07c.76 0 .98.22.98.98v7.42c0 .84.5 1.26 1.24 1.26.73 0 1.23-.42 1.23-1.26v-9.15c0-1.48-.89-2.19-2.5-2.19z',
    activityLevel: 0.85,
    backgroundColor: 'bg-blue-100 dark:bg-blue-900/30',
    iconColor: 'text-blue-600 dark:text-blue-400'
  },
  {
    id: 'education',
    name: 'Education',
    icon: 'M21.08 11.02L21.08 6.65C21.08 5.53 20.21 4.9 18.9 4.9L18.9 4.9C18.32 4.9 17.3 4.9 16.07 4.9C14.51 4.9 13.18 3.93 13.18 2.5C13.18 2.2 12.99 2 12.75 2L5.5 2C3.89 2 2.58 3.38 2.58 5.09L2.58 19C2.58 20.66 3.83 22 5.37 22L18.32 22C19.86 22 21.08 20.66 21.08 19L21.08 16.92C21.08 16.61 20.51 16.49 20.35 16.78C20.19 17.08 20.15 17.67 20.01 18.02C19.82 18.49 19.34 18.79 18.8 18.79L8.46 18.79L8.46 18.79C7.83 18.79 7.41 18.09 7.71 17.5C7.89 17.12 8.29 16.87 8.73 16.87L18.32 16.87C19.86 16.87 21.08 15.53 21.08 13.87L21.08 13.87C21.08 13.11 20.7 12.43 20.08 12.02C19.96 11.94 19.84 11.87 19.75 11.81C19.64 11.74 19.5 11.7 19.35 11.7C18.97 11.7 18.68 12.04 18.68 12.46C18.68 12.73 18.8 12.97 18.97 13.1C19.24 13.31 19.42 13.61 19.42 13.95C19.42 14.66 18.92 15.23 18.32 15.23L8.2 15.23C7.36 15.23 6.64 14.43 6.64 13.4C6.64 12.38 7.2 11.57 8.16 11.09C8.5 10.94 8.73 10.59 8.73 10.18C8.73 9.76 8.43 9.42 8.05 9.42C7.92 9.42 7.78 9.46 7.66 9.55C7.58 9.61 7.46 9.68 7.35 9.76C6.73 10.18 6.35 10.85 6.35 11.61C6.35 11.73 6.36 11.86 6.38 11.98C6.41 12.12 6.43 12.29 6.43 12.46C6.43 12.81 6.04 13.03 5.76 12.84C5.48 12.66 5.18 12.38 4.91 12.02C4.29 11.16 4.24 9.94 4.92 9.01C5.21 8.61 5.61 8.3 6.08 8.13C6.62 7.93 7.14 7.65 7.22 7.59C7.84 7.17 8.23 6.51 8.23 5.76C8.23 4.57 7.35 3.62 6.25 3.62C5.15 3.62 4.26 4.57 4.26 5.76C4.26 6.12 3.87 6.33 3.58 6.15C3.57 6.14 3.55 6.13 3.54 6.12C3.18 5.81 2.94 5.34 2.94 4.81C2.94 4.81 2.94 4.81 2.94 4.81C2.94 3.68 3.82 2.72 4.97 2.72C6.11 2.72 7 3.68 7 4.81C7 4.81 7 4.81 7 4.81C7 5.27 6.83 5.69 6.55 6C6.51 6.04 6.48 6.09 6.48 6.14C6.48 6.28 6.65 6.35 6.76 6.26C7.03 6.06 7.34 5.91 7.68 5.83C8.31 5.66 8.81 5.12 8.9 4.43C8.99 3.54 8.31 2.74 7.43 2.61C7.26 2.58 7.1 2.58 6.95 2.61C6.76 2.63 6.57 2.48 6.57 2.29C6.57 2.13 6.7 2 6.85 2L12.1 2C12.22 2 12.31 2.11 12.29 2.24C11.97 4.07 13.26 5.76 14.99 5.76L18.9 5.76C19.24 5.76 19.53 6.06 19.53 6.42L19.53 11.02C19.53 11.32 19.69 11.59 19.91 11.78C20.13 11.96 20.42 12.05 20.7 12.02C20.9 12 21.05 11.86 21.08 11.67C21.08 11.46 21.08 11.26 21.08 11.02ZM16.01 11.46C16.34 11.46 16.6 11.74 16.6 12.1C16.6 12.45 16.34 12.74 16.01 12.74L10.58 12.74C10.25 12.74 9.99 12.45 9.99 12.1C9.99 11.74 10.25 11.46 10.58 11.46L16.01 11.46ZM14.28 8.88C14.61 8.88 14.88 9.17 14.88 9.52C14.88 9.88 14.61 10.16 14.28 10.16L10.58 10.16C10.25 10.16 9.99 9.88 9.99 9.52C9.99 9.17 10.25 8.88 10.58 8.88L14.28 8.88Z',
    activityLevel: 0.7,
    backgroundColor: 'bg-green-100 dark:bg-green-900/30',
    iconColor: 'text-green-600 dark:text-green-400'
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    icon: 'M16.72 12.15L16.72 12.15C18.51 12.15 19.97 13.61 19.97 15.4L19.97 15.41C19.97 17.2 18.51 18.66 16.72 18.66C14.93 18.66 13.47 17.2 13.47 15.41C13.47 13.62 14.93 12.15 16.72 12.15ZM9.77 6.45L9.77 6.45C11.05 6.45 12.09 7.49 12.09 8.77C12.09 10.05 11.05 11.09 9.77 11.09C8.49 11.09 7.45 10.05 7.45 8.77C7.45 7.49 8.49 6.45 9.77 6.45ZM16.72 13.72L16.72 13.72C15.8 13.72 15.05 14.48 15.05 15.4C15.05 16.33 15.8 17.08 16.72 17.08C17.65 17.08 18.4 16.33 18.4 15.4L18.4 15.4C18.4 14.48 17.65 13.72 16.72 13.72ZM9.77 8.03L9.77 8.03C9.37 8.03 9.03 8.36 9.03 8.77C9.03 9.18 9.37 9.52 9.77 9.52C10.18 9.52 10.52 9.18 10.52 8.77C10.52 8.36 10.18 8.03 9.77 8.03ZM4.19 19.7L4.19 19.7C3.76 20.13 3.06 20.13 2.63 19.7C2.2 19.27 2.2 18.57 2.63 18.14L2.64 18.13L4.17 16.61C4.25 16.52 4.25 16.38 4.15 16.28L2.68 14.81C2.24 14.37 2.24 13.68 2.68 13.24C3.11 12.81 3.8 12.81 4.23 13.24L5.7 14.71C5.79 14.81 5.94 14.81 6.04 14.71L7.62 13.14C7.62 13.14 7.62 13.14 7.62 13.14C7.62 13.14 7.62 13.14 7.62 13.14C7.95 13.08 8.29 13.05 8.63 13.05L8.63 13.05C8.8 13.05 8.97 13.06 9.13 13.07C9.27 13.08 9.41 13.1 9.55 13.12C9.67 13.13 9.8 13.17 9.91 13.21L9.91 13.21C10.39 13.36 10.84 13.62 11.21 13.99C12.45 15.23 12.45 17.23 11.21 18.47C10.95 18.73 10.66 18.92 10.34 19.07L10.32 19.08C9.91 19.25 9.48 19.35 9.03 19.36L8.85 19.4C8.45 19.51 8.04 19.57 7.61 19.57L7.61 19.57L7.61 19.57C6.59 19.57 5.59 19.23 4.76 18.62C4.72 18.58 4.7 18.56 4.66 18.54C4.54 18.56 4.42 18.6 4.32 18.7L4.19 18.82L4.19 19.7Z',
    activityLevel: 0.65,
    backgroundColor: 'bg-purple-100 dark:bg-purple-900/30',
    iconColor: 'text-purple-600 dark:text-purple-400'
  },
  {
    id: 'nightlife',
    name: 'Nightlife',
    icon: 'M18.01 19.99L18.01 5.99C18.01 4.47 16.86 3.23 15.35 3.05L15.35 3.05C15.16 3.03 15.08 2.8 15.2 2.66L15.6 2.19C15.83 1.92 15.69 1.51 15.34 1.43L15.34 1.43C14.12 1.15 12.9 0.99 11.68 0.97L11.68 0.97C11.14 0.97 10.62 0.97 10.08 1.01L9.44 1.04C9.1 1.05 8.89 1.31 8.91 1.64L8.91 1.64C8.93 1.94 9.18 2.16 9.48 2.14L9.48 2.14C10.31 2.08 11.15 2.06 11.98 2.09C12.83 2.12 13.68 2.21 14.52 2.38L14.52 2.38C14.69 2.41 14.82 2.58 14.77 2.75L14.53 3.53C14.45 3.82 14.62 4.13 14.91 4.22L14.91 4.22C16.01 4.55 16.55 5.5 16.55 6.67L16.55 16.77C16.55 17.2 16.2 17.55 15.77 17.55L15.77 17.55C15.35 17.55 15 17.2 15 16.77L15 7.11C15 6.68 14.65 6.33 14.22 6.33L8.77 6.33C8.35 6.33 8 6.68 8 7.11L8 16.77C8 17.2 7.65 17.55 7.22 17.55L7.22 17.55C6.8 17.55 6.45 17.2 6.45 16.77L6.45 6.67C6.45 5.5 6.99 4.55 8.09 4.22L8.09 4.22C8.38 4.13 8.55 3.82 8.47 3.53L8.23 2.75C8.18 2.58 8.31 2.41 8.48 2.38L8.48 2.38C8.93 2.29 9.39 2.22 9.85 2.18L9.85 2.18C10.66 2.09 11.48 2.07 12.29 2.09C12.63 2.1 12.97 2.12 13.31 2.15L13.31 2.15C13.46 2.17 13.58 2.01 13.53 1.87L13.53 1.87C13.5 1.77 13.46 1.67 13.4 1.58C13.26 1.37 13.04 1.21 12.8 1.13L12.8 1.13C12.15 0.93 11.48 0.85 10.81 0.87L10.81 0.87C10.07 0.89 9.33 0.97 8.6 1.12L8.6 1.12C8.01 1.24 7.45 1.67 7.32 2.27L7.01 3.87C6.91 4.34 6.45 4.63 5.98 4.53L5.98 4.53C5.56 4.44 5.28 4.04 5.33 3.61L5.64 1.49C5.95 -0.35 7.84 -0.55 9.49 0.47L9.49 0.47C9.95 0.71 10.45 0.83 10.95 0.82L10.95 0.82C12.33 0.79 13.71 0.97 15.03 1.38L15.03 1.38C16.84 1.93 17.6 3.22 17.16 5.06L16.83 6.4C16.74 6.83 16.99 7.26 17.41 7.34L17.41 7.34C17.81 7.43 18.19 7.13 18.21 6.72L18.24 6.04C18.28 5.09 18.69 4.2 19.36 3.51L19.36 3.51C19.7 3.17 20.24 3.17 20.58 3.51L21.47 4.39C21.81 4.73 21.81 5.27 21.47 5.61L21.27 5.81C20.52 6.56 20.1 7.59 20.1 8.66L20.1 14.82C20.1 15.69 19.81 16.53 19.27 17.23L19.27 17.23C19.06 17.49 19.11 17.87 19.37 18.08L19.48 18.16C19.83 18.45 19.83 18.99 19.48 19.28L18.9 19.77C18.65 19.98 18.26 19.98 18.01 19.77L18.01 19.99Z',
    activityLevel: 0.8,
    backgroundColor: 'bg-indigo-100 dark:bg-indigo-900/30',
    iconColor: 'text-indigo-600 dark:text-indigo-400'
  },
  {
    id: 'shopping',
    name: 'Shopping',
    icon: 'M21 8.25H18.75V7.5C18.75 4.605 16.395 2.25 13.5 2.25C10.605 2.25 8.25 4.605 8.25 7.5V8.25H6C4.35 8.25 3 9.6 3 11.25V18.75C3 20.4 4.35 21.75 6 21.75H18C19.65 21.75 21 20.4 21 18.75V11.25C21 9.6 19.65 8.25 18 8.25ZM9.75 7.5C9.75 5.43 11.43 3.75 13.5 3.75C15.57 3.75 17.25 5.43 17.25 7.5V8.25H9.75V7.5ZM19.5 18.75C19.5 19.575 18.825 20.25 18 20.25H6C5.175 20.25 4.5 19.575 4.5 18.75V11.25C4.5 10.425 5.175 9.75 6 9.75H18C18.825 9.75 19.5 10.425 19.5 11.25V18.75ZM13.5 15.75C12.675 15.75 12 15.075 12 14.25C12 13.425 12.675 12.75 13.5 12.75C14.325 12.75 15 13.425 15 14.25C15 15.075 14.325 15.75 13.5 15.75Z',
    activityLevel: 0.75,
    backgroundColor: 'bg-pink-100 dark:bg-pink-900/30',
    iconColor: 'text-pink-600 dark:text-pink-400'
  },
];

const QuickNavigation = () => {
  // Animation variants for staggered appearance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };

  return (
    <section className="py-12 bg-light-cream dark:bg-navy-900">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-serif font-bold text-navy-900 dark:text-cream">Explore Categories</h2>
          <button className="text-coral-500 hover:text-coral-600 dark:hover:text-coral-400 font-medium flex items-center gap-1 transition-colors">
            <span>View All</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {categories.map((category) => (
            <motion.div
              key={category.id}
              variants={itemVariants}
              className="relative"
            >
              <Link to={`/category/${category.id}`}>
                <div className={`${category.backgroundColor} rounded-xl p-4 h-32 flex flex-col justify-between transition-all hover:shadow-lg hover:-translate-y-1 duration-300`}>
                  <div className="flex justify-between items-start">
                    <div className={`${category.iconColor} p-2 rounded-lg bg-white dark:bg-navy-800 bg-opacity-60 dark:bg-opacity-20`}>
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path d={category.icon} />
                      </svg>
                    </div>
                    
                    {/* Activity indicator */}
                    <div className="flex items-center">
                      <span className="text-xs text-gray-600 dark:text-gray-400 mr-1">{Math.round(category.activityLevel * 100)}%</span>
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
                className={`h-1 w-4 rounded-full ${i === 0 ? 'bg-coral' : 'bg-gray-300 dark:bg-gray-700'}`}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuickNavigation;