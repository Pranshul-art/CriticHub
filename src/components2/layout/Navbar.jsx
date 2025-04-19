import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const location = useLocation();
  
  // Check scroll position to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close menus when changing routes
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location]);
  
  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/90 dark:bg-navy-900/90 backdrop-blur-md py-3 shadow-md' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <div className="relative">
            <div className="absolute inset-0 bg-coral-500 rounded-full blur-sm opacity-50"></div>
            <div className="h-10 w-10 bg-gradient-to-br from-coral-500 to-teal rounded-full flex items-center justify-center relative">
              <span className="font-serif text-white text-xl font-bold">C</span>
            </div>
          </div>
          <span className="font-serif text-2xl font-bold ml-2 text-gray dark:text-cream">
            Critics<span className="text-coral-500 ">Hub</span>
          </span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <NavLink to="/">Discover</NavLink>
          <NavLink to="/itinerary">Itineraries</NavLink>
          <NavLink to="/education">Education</NavLink>
          <NavLink to="/create">Create</NavLink>
        </nav>
        
        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          {/* Search Button - Desktop */}
          <button className="hidden md:flex items-center justify-center h-10 w-10 rounded-full bg-light-cream dark:bg-navy-800 hover:bg-coral-500/10 dark:hover:bg-coral-500/10 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-navy-700 dark:text-cream" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          
          {/* Dark Mode Toggle */}
          <button 
            onClick={toggleDarkMode}
            className="flex items-center justify-center h-10 w-10 rounded-full bg-light-cream dark:bg-navy-800 hover:bg-coral-500/10 dark:hover:bg-coral-500/10 transition-colors"
          >
            {darkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cream hover:text-coral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-navy-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
          
          {/* User Profile - Desktop */}
          <div className="hidden md:block relative">
            <button 
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center justify-center h-10 w-10 rounded-full bg-coral-500 text-white font-medium text-sm hover:bg-coral-600 transition-colors"
            >
              AC
            </button>
            
            {/* User Dropdown */}
            {userDropdownOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-navy-800 shadow-lg py-2 z-50"
              >
                <Link to="/profile" className="block px-4 py-2 text-navy-700 dark:text-cream hover:bg-light-cream dark:hover:bg-navy-700">
                  My Profile
                </Link>
                <Link to="/settings" className="block px-4 py-2 text-navy-700 dark:text-cream hover:bg-light-cream dark:hover:bg-navy-700">
                  Settings
                </Link>
                <Link to="/saved" className="block px-4 py-2 text-navy-700 dark:text-cream hover:bg-light-cream dark:hover:bg-navy-700">
                  Saved Critiques
                </Link>
                <hr className="my-2 border-gray-200 dark:border-navy-700" />
                <button className="block w-full text-left px-4 py-2 text-coral-500 hover:bg-light-cream dark:hover:bg-navy-700">
                  Sign Out
                </button>
              </motion.div>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center justify-center h-10 w-10 rounded-full bg-light-cream dark:bg-navy-800 hover:bg-coral-500/10 dark:hover:bg-coral-500/10 transition-colors"
          >
            {mobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-navy-700 dark:text-cream" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-navy-700 dark:text-cream" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-white dark:bg-navy-900 shadow-lg"
        >
          <div className="container mx-auto px-4 py-6">
            <nav className="flex flex-col space-y-4">
              <MobileNavLink to="/">Discover</MobileNavLink>
              <MobileNavLink to="/itinerary">Itineraries</MobileNavLink>
              <MobileNavLink to="/education">Education</MobileNavLink>
              <MobileNavLink to="/create">Create</MobileNavLink>
              
              <hr className="my-2 border-gray-200 dark:border-navy-800" />
              
              {/* User Options on Mobile */}
              <MobileNavLink to="/profile">My Profile</MobileNavLink>
              <MobileNavLink to="/settings">Settings</MobileNavLink>
              <MobileNavLink to="/saved">Saved Critiques</MobileNavLink>
              
              <button className="flex items-center justify-between w-full px-4 py-2 font-medium text-coral-500 hover:bg-light-cream dark:hover:bg-navy-800 rounded-lg transition-colors">
                Sign Out
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </nav>
          </div>
        </motion.div>
      )}
    </header>
  );
};

// Desktop Navigation Link Component
const NavLink = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={`relative font-medium transition-colors ${
        isActive ? 'text-coral-500' : 'text-navy-700 dark:text-cream hover:text-coral-500 dark:hover:text-coral-500'
      }`}
    >
      {children}
      {isActive && (
        <motion.div
          layoutId="navHighlight"
          className="absolute bottom-0 left-0 right-0 h-1 bg-coral-500 rounded-full"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
    </Link>
  );
};

// Mobile Navigation Link Component
const MobileNavLink = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={`flex items-center justify-between px-4 py-2 font-medium rounded-lg transition-colors ${
        isActive 
          ? 'bg-coral-500/10 text-coral-500' 
          : 'text-navy-700 dark:text-cream hover:bg-light-cream dark:hover:bg-navy-800'
      }`}
    >
      {children}
      {isActive && (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      )}
    </Link>
  );
};

export default Navbar;