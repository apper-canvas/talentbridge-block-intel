import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import SearchBar from '@/components/molecules/SearchBar';
import ApperIcon from '@/components/ApperIcon';
import { notificationService } from '@/services/api/notificationService';

const Header = () => {
const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

const navigation = [
    { name: 'Jobs', href: '/jobs', icon: 'Briefcase' },
    { name: 'Companies', href: '/companies', icon: 'Building2' },
    { name: 'My Applications', href: '/applications', icon: 'FileText' },
    { name: 'Profile', href: '/profile', icon: 'User' }
  ];

  useEffect(() => {
    loadUnreadCount();
  }, []);

  const loadUnreadCount = async () => {
    try {
      const notifications = await notificationService.getAll();
      const unread = notifications.filter(n => !n.read).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error('Error loading notification count:', err);
    }
  };

  const handleSearch = (query) => {
    navigate(`/jobs?search=${encodeURIComponent(query)}`);
  };

  return (
    <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <ApperIcon name="Zap" size={24} className="text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">TalentBridge</span>
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:block flex-1 max-w-lg mx-8">
            <SearchBar onSearch={handleSearch} />
          </div>

{/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === item.href
                    ? 'bg-primary-50 text-primary-700 border-2 border-primary-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <ApperIcon name={item.icon} size={18} className="mr-2" />
                {item.name}
              </Link>
            ))}
            
            {/* Notifications */}
            <Link
              to="/notifications"
              className={`relative flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                location.pathname === '/notifications'
                  ? 'bg-primary-50 text-primary-700 border-2 border-primary-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <ApperIcon name="Bell" size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <ApperIcon name={isMobileMenuOpen ? "X" : "Menu"} size={24} />
            </button>
          </div>
        </div>
{/* Mobile Search */}
        <div className="md:hidden px-4 pb-4">
          <SearchBar onSearch={handleSearch} className="w-full" />
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden bg-white border-t border-gray-200"
        >
<div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  location.pathname === item.href
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <ApperIcon name={item.icon} size={20} className="mr-3" />
                {item.name}
              </Link>
            ))}
            
            {/* Mobile Notifications */}
            <Link
              to="/notifications"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors ${
                location.pathname === '/notifications'
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <div className="relative mr-3">
                <ApperIcon name="Bell" size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </div>
              Notifications
            </Link>
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Header;