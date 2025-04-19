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
                Discover experiences through <span className="text-coral-500 ">honest</span> critics
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