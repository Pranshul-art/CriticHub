import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import CategoryNav from '../components2/home/CategoryNav';
import FeaturedCritiques from '../components2/home/FeaturedCritiques';
import TrendingSection from '../components2/home/TrendingSection';
import PersonalizedFeed from '../components2/home/PersonalizedFeed';
import SearchOverlay from '../components2/search/SearchOverlay';
import MoodSelector from '../components2/home/MoodSelector';

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
    const Timeout=setTimeout(()=>{
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
      loader.load('/src/assets/earth_day.jpg', (texture) => {
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
      const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
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
      
      
      
    
    },1300);
    // Handle window resize
    const handleResize = () => {
      if (!globeContainerRef.current || !rendererRef.current || !cameraRef.current) return;
      
      const container = globeContainerRef.current;
      const renderer = rendererRef.current;
      const camera = cameraRef.current;
      
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
      
      window.addEventListener('resize', handleResize);
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (rendererRef.current && rendererRef.current.domElement && globeContainerRef.current) {
        globeContainerRef.current.removeChild(rendererRef.current.domElement);
      }
      clearTimeout(Timeout);
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
    
    // addHotspots(trendingLocations);
  }, []);

  return (
    <div className="">
      {/* Hero Section with 3D Globe */}
      <section className=" h-screen max-h-[800px] overflow-hidden bg-gradient-to-b from-dark to-light-dark dark:from-navy-900 dark:to-navy-800">
        {/* Globe Container */}
        <div 
          ref={globeContainerRef}
          className="absolute inset-0 opacity-100"
        />
        
        
        
        {/* Hero Content */}
        <div className="container mx-auto h-full flex flex-col justify-center items-center  z-10 px-4">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.8 }}
            className="text-center max-w-3xl"
          >
            <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 text-navy-900 dark:text-cream">
              <span className="text-coral-500 ">Discover</span> What Matters
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
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 2, delay: 0.3 }}
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
            <button className="bg-white text-coral-500 font-bold text-lg px-8 py-4 rounded-xl hover:bg-navy-900 hover:text-white transition-colors shadow-lg" 
            onClick={()=>{window.location.href='/create'}}>
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