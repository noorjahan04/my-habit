import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaHeart, 
  FaQuoteLeft, 
  FaQuoteRight, 
  FaShare, 
  FaBookmark, 
  FaArrowLeft,
  FaSync,
  FaEnvelope,
  FaBell,
  FaPalette,
  FaRandom
} from 'react-icons/fa';

const SoulFuel = () => {
  const [currentMessage, setCurrentMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Fixed: Added const declaration
  const [isAnimating, setIsAnimating] = useState(false);
  const [savedMessages, setSavedMessages] = useState([]);
  const [notificationSettings, setNotificationSettings] = useState({
    soulfuel: true,
    email: false
  });

  // Color themes for different categories
  const themes = {
    motivation: {
      gradient: 'from-purple-500 to-pink-500',
      bg: 'bg-gradient-to-br from-purple-50 to-pink-50',
      text: 'text-purple-800',
      border: 'border-purple-200'
    },
    inspiration: {
      gradient: 'from-blue-500 to-teal-500',
      bg: 'bg-gradient-to-br from-blue-50 to-teal-50',
      text: 'text-blue-800',
      border: 'border-blue-200'
    },
    wisdom: {
      gradient: 'from-green-500 to-emerald-500',
      bg: 'bg-gradient-to-br from-green-50 to-emerald-50',
      text: 'text-green-800',
      border: 'border-green-200'
    },
    peace: {
      gradient: 'from-indigo-500 to-purple-500',
      bg: 'bg-gradient-to-br from-indigo-50 to-purple-50',
      text: 'text-indigo-800',
      border: 'border-indigo-200'
    },
    default: {
      gradient: 'from-gray-500 to-blue-500',
      bg: 'bg-gradient-to-br from-gray-50 to-blue-50',
      text: 'text-gray-800',
      border: 'border-gray-200'
    }
  };

  // Fetch daily SoulFuel message
  const fetchSoulFuel = async () => {
    try {
      setIsAnimating(true);
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      const response = await fetch('https://my-habit-4.onrender.com/soulfuel/daily', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch SoulFuel message');
      }

      const data = await response.json();
      
      if (data.success) {
        setCurrentMessage(data.data);
        
        // Add to recently viewed
        setTimeout(() => {
          setSavedMessages(prev => {
            const filtered = prev.filter(msg => msg.message !== data.data.message);
            return [data.data, ...filtered].slice(0, 5);
          });
        }, 500);
      }
    } catch (err) {
      console.error('Error fetching SoulFuel:', err);
      setError(err.message);
      
      // Fallback message
      setCurrentMessage({
        message: "You are capable of amazing things. Believe in yourself! 🌟",
        author: "SoulFuel Team",
        category: "motivation"
      });
    } finally {
      setLoading(false);
      setTimeout(() => setIsAnimating(false), 1000);
    }
  };

  // Save message to favorites
  const saveMessage = () => {
    if (!currentMessage) return;
    
    const favorites = JSON.parse(localStorage.getItem('soulfuelFavorites') || '[]');
    const isAlreadySaved = favorites.some(fav => fav.message === currentMessage.message);
    
    if (!isAlreadySaved) {
      const updatedFavorites = [...favorites, { ...currentMessage, savedAt: new Date() }];
      localStorage.setItem('soulfuelFavorites', JSON.stringify(updatedFavorites));
      
      // Show success feedback
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 600);
    }
  };

  // Share message
  const shareMessage = async () => {
    if (!currentMessage) return;

    const shareText = `"${currentMessage.message}" - ${currentMessage.author}\n\nShared from SoulFuel App 💫`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Daily SoulFuel',
          text: shareText,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareText).then(() => {
        alert('Message copied to clipboard!');
      });
    }
  };

  // Update notification settings
  const updateNotificationSettings = async (setting, value) => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('id');
      
      const response = await fetch(`https://my-habit-4.onrender.com/users/${userId}/notifications`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          [setting]: value
        }),
      });

      if (response.ok) {
        setNotificationSettings(prev => ({
          ...prev,
          [setting]: value
        }));
      }
    } catch (err) {
      console.error('Error updating notification settings:', err);
    }
  };

  // Load initial data
  useEffect(() => {
    fetchSoulFuel();
    
    // Load saved messages from localStorage
    const favorites = JSON.parse(localStorage.getItem('soulfuelFavorites') || '[]');
    setSavedMessages(favorites.slice(0, 5));
  }, []);

  const currentTheme = themes[currentMessage?.category] || themes.default;

  return (
    <div className={`min-h-screen ${currentTheme.bg} transition-all duration-1000 p-4 md:p-8`}>
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            to="/dashboard"
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/80 backdrop-blur-sm shadow-lg hover:bg-white transition-all duration-300 group"
          >
            <FaArrowLeft className="text-gray-600 group-hover:text-purple-600 transition-colors" />
            <span className="text-gray-700 font-medium">Back to Dashboard</span>
          </Link>
          
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Daily SoulFuel
            </h1>
            <p className="text-gray-600 mt-1">Your daily dose of inspiration 💫</p>
          </div>
          
          <div className="w-20"></div> {/* Spacer for balance */}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* SoulFuel Card - Main Content */}
          <div className="lg:col-span-2">
            <div className={`relative rounded-3xl shadow-2xl overflow-hidden backdrop-blur-sm transition-all duration-1000 ${isAnimating ? 'scale-95 opacity-90' : 'scale-100 opacity-100'}`}>
              
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${currentTheme.gradient} opacity-10`}></div>
              
              {/* Animated Background Elements */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
              </div>

              <div className="relative p-8 md:p-12">
                
                {/* Loading State */}
                {loading && (
                  <div className="text-center py-20">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading your inspiration...</p>
                  </div>
                )}

                {/* Error State */}
                {error && !loading && (
                  <div className="text-center py-12">
                    <div className="text-red-500 text-6xl mb-4">💔</div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Oops! Something went wrong</h3>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button 
                      onClick={fetchSoulFuel}
                      className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                    >
                      Try Again
                    </button>
                  </div>
                )}

                {/* SoulFuel Message */}
                {!loading && !error && currentMessage && (
                  <div className="text-center space-y-8">
                    
                    {/* Quote Icon */}
                    <div className="flex justify-center">
                      <FaQuoteLeft className={`text-4xl ${currentTheme.text} opacity-50 transform -translate-x-2`} />
                      <FaQuoteRight className={`text-4xl ${currentTheme.text} opacity-50 transform translate-x-2`} />
                    </div>

                    {/* Message */}
                    <div className="space-y-6">
                      <p className={`text-2xl md:text-3xl lg:text-4xl font-light leading-relaxed ${currentTheme.text} transition-all duration-1000 ${isAnimating ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'}`}>
                        "{currentMessage.message}"
                      </p>
                      
                      {/* Author */}
                      <div className={`border-t ${currentTheme.border} pt-6 transition-all duration-1000 delay-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
                        <p className={`text-xl font-medium ${currentTheme.text}`}>
                          — {currentMessage.author}
                        </p>
                        {currentMessage.category && (
                          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${currentTheme.bg} ${currentTheme.text} border ${currentTheme.border}`}>
                            {currentMessage.category}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-center space-x-4 pt-6">
                      <button
                        onClick={fetchSoulFuel}
                        disabled={loading}
                        className="flex items-center space-x-2 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
                      >
                        <FaSync className={`text-purple-600 ${loading ? 'animate-spin' : ''}`} />
                        <span className="font-semibold text-gray-700">New Message</span>
                      </button>

                      <button
                        onClick={saveMessage}
                        className="flex items-center space-x-2 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      >
                        <FaBookmark className="text-yellow-500" />
                        <span className="font-semibold text-gray-700">Save</span>
                      </button>

                      <button
                        onClick={shareMessage}
                        className="flex items-center space-x-2 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      >
                        <FaShare className="text-blue-500" />
                        <span className="font-semibold text-gray-700">Share</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Notification Settings */}
            <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Notification Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FaBell className="text-purple-500" />
                    <span className="text-gray-700">Push Notifications</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={notificationSettings.soulfuel}
                      onChange={(e) => updateNotificationSettings('soulfuel', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FaEnvelope className="text-blue-500" />
                    <span className="text-gray-700">Email Notifications</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={notificationSettings.email}
                      onChange={(e) => updateNotificationSettings('email', e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            
            {/* Saved Messages */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                <FaBookmark className="text-yellow-500" />
                <span>Saved Messages</span>
              </h3>
              
              {savedMessages.length === 0 ? (
                <div className="text-center py-8">
                  <FaBookmark className="text-gray-400 text-3xl mx-auto mb-3" />
                  <p className="text-gray-500">No saved messages yet</p>
                  <p className="text-sm text-gray-400">Save your favorite quotes here!</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {savedMessages.map((message, index) => (
                    <div 
                      key={index}
                      className={`p-4 rounded-xl border-l-4 ${themes[message.category]?.border || themes.default.border} bg-white/50 backdrop-blur-sm transition-all duration-300 hover:shadow-md cursor-pointer`}
                      onClick={() => {
                        setCurrentMessage(message);
                        setIsAnimating(true);
                        setTimeout(() => setIsAnimating(false), 600);
                      }}
                    >
                      <p className="text-sm text-gray-700 line-clamp-3">"{message.message}"</p>
                      <p className="text-xs text-gray-500 mt-2">— {message.author}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Journey</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-purple-50 rounded-xl">
                  <div className="text-2xl font-bold text-purple-600">{savedMessages.length}</div>
                  <div className="text-sm text-purple-500">Saved</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <div className="text-2xl font-bold text-blue-600">∞</div>
                  <div className="text-sm text-blue-500">Inspiration</div>
                </div>
              </div>
            </div>

            {/* Daily Tip */}
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-2 flex items-center space-x-2">
                <FaPalette className="text-yellow-300" />
                <span>Daily Tip</span>
              </h3>
              <p className="text-sm opacity-90">
                Take a moment to reflect on today's message. Let it inspire your actions throughout the day.
              </p>
            </div>
          </div>
        </div>

        {/* Floating Action Button */}
        <button
          onClick={fetchSoulFuel}
          disabled={loading}
          className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-2xl flex items-center justify-center text-white hover:shadow-3xl transition-all duration-300 transform hover:scale-110 disabled:opacity-50 z-50"
        >
          <FaRandom className={`text-lg ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </div>
  );
};

export default SoulFuel;