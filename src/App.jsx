import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components2/layout/Navbar';
import Footer from './components2/layout/Footer';
import LoadingSpinner from './components2/ui/LoadingSpinner';


const HomePage = lazy(() => import('./pages/HomePage'));
// const CriticProfile = lazy(() => import('./pages/CriticProfile'));
// const DetailPage = lazy(() => import('./pages/DetailPage'));
 const ItineraryBuilder = lazy(() => import('./components/Prototype'));
// const EducationExplorer = lazy(() => import('./pages/EducationExplorer'));
// const CreationStudio = lazy(() => import('./pages/CreationStudio'));

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
                <Route path="/itinerary" element={<ItineraryBuilder />} />
                {/* <Route path="/critic/:id" element={<CriticProfile />} />
                <Route path="/detail/:type/:id" element={<DetailPage />} />
                
                <Route path="/education" element={<EducationExplorer />} />
                <Route path="/create" element={<CreationStudio />} /> */}
              </Routes>
            </Suspense>
            <Footer />
          </div>
        </div>
      </Router>
    );
}

export default App
