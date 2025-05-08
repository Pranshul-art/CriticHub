import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components2/layout/Navbar';
import Footer from './components2/layout/Footer';
import LoadingSpinner from './components2/ui/LoadingSpinner';

// Lazy loaded components
const HomePage = lazy(() => import('./pages/HomePage'));
const CriticProfile = lazy(() => import('./pages/CriticProfile'));
const ItineraryBuilder = lazy(() => import('./pages/Itinerary'));
const Explore = lazy(() => import('./pages/Explore'));

// Direct imports for troubleshooting
import SignUp from './pages/SignUp';
import Signin from './pages/Signin';

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
      <Routes>
        <Route path="/signin" element={<Signin />} />
        <Route path="/" element={<SignUp />} />
        <Route
          path="*"
          element={
            <div className={`${darkMode ? 'dark' : ''} min-h-screen transition-colors duration-300`}>
              <div className="bg-cream dark:bg-navy-900 text-navy-900 dark:text-cream min-h-screen">
                <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
                <Suspense fallback={<LoadingSpinner />}>
                  <Routes>
                    <Route path="/dashboard" element={<HomePage />} />
                    <Route path="/itinerary" element={<ItineraryBuilder />} />
                    <Route path="/critic/:id" element={<CriticProfile />} />
                    <Route path="/create" element={<CriticProfile />} />
                    <Route path="/explore" element={<Explore />} />
                  </Routes>
                </Suspense>
                <Footer />
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;