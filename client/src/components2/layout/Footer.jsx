import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-navy-900 text-cream">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo and Description */}
          <div className="lg:col-span-1">
            <Link to="/dashboard" className="flex items-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-coral-500 rounded-full blur-sm opacity-50"></div>
                <div className="h-10 w-10 bg-gradient-to-br from-navy-900 to-teal rounded-full flex items-center justify-center relative">
                  <span className="font-serif text-white text-xl font-bold">C</span>
                </div>
              </div>
              <span className="font-serif text-2xl font-bold ml-2 text-cream">
                Critics<span className="text-coral-500 ">Hub</span>
              </span>
            </Link>
            <p className="text-gray-400 mb-6">
              Discover what truly matters with authentic perspectives from real critics worldwide.
            </p>
            <div className="flex space-x-4">
              <FooterSocialIcon icon="twitter" />
              <FooterSocialIcon icon="instagram" />
              <FooterSocialIcon icon="facebook" />
              <FooterSocialIcon icon="linkedin" />
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold mb-6">Explore</h3>
            <ul className="space-y-4">
              <FooterLink to="/trending">Trending Now</FooterLink>
              <FooterLink to="/categories">Categories</FooterLink>
              <FooterLink to="/cities">Cities</FooterLink>
              <FooterLink to="/critics">Top Critics</FooterLink>
              <FooterLink to="/itineraries">Popular Itineraries</FooterLink>
            </ul>
          </div>
          
          {/* Company */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold mb-6">Company</h3>
            <ul className="space-y-4">
              <FooterLink to="/about">About Us</FooterLink>
              <FooterLink to="/careers">Careers</FooterLink>
              <FooterLink to="/press">Press</FooterLink>
              <FooterLink to="/contact">Contact</FooterLink>
              <FooterLink to="/blog">Blog</FooterLink>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold mb-6">Get the Weekly Digest</h3>
            <p className="text-gray-400 mb-4">
              Stay updated with the best new critiques and city guides.
            </p>
            <form className="mb-4">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-grow px-4 py-3 bg-navy-800 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-coral-500 text-cream placeholder-gray-500"
                />
                <button
                  type="submit"
                  className="bg-coral-500 hover:bg-coral-600 transition-colors px-4 py-3 rounded-r-lg text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </form>
            <p className="text-xs text-gray-500">
              By subscribing, you agree to our <Link to="/privacy" className="text-coral-500 hover:underline">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="border-t border-navy-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              © {currentYear} CriticsHub. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center space-x-6">
              <Link to="/terms" className="text-gray-500 hover:text-coral-500 text-sm">
                Terms of Service
              </Link>
              <Link to="/privacy" className="text-gray-500 hover:text-coral-500 text-sm">
                Privacy Policy
              </Link>
              <Link to="/cookies" className="text-gray-500 hover:text-coral-500 text-sm">
                Cookie Policy
              </Link>
              <Link to="/accessibility" className="text-gray-500 hover:text-coral-500 text-sm">
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Footer Link Component
const FooterLink = ({ to, children }) => (
  <li>
    <Link to={to} className="text-gray-400 hover:text-coral-500 transition-colors">
      {children}
    </Link>
  </li>
);

// Footer Social Icon Component
const FooterSocialIcon = ({ icon }) => {
  let iconSvg;
  
  switch (icon) {
    case 'twitter':
      iconSvg = (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
        </svg>
      );
      break;
    case 'instagram':
      iconSvg = (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      );
      break;
    case 'facebook':
      iconSvg = (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
        </svg>
      );
      break;
    case 'linkedin':
      iconSvg = (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/>
        </svg>
      );
      break;
    default:
      iconSvg = null;
  }
  
  return (
    <a 
      href="#" 
      className="h-10 w-10 rounded-full bg-navy-800 flex items-center justify-center text-gray-400 hover:bg-coral-500 hover:text-white transition-colors"
    >
      {iconSvg}
    </a>
  );
};

export default Footer;