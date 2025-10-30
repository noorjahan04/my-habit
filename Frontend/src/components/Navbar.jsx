import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaHeartbeat, FaUserCircle, FaChartLine, FaUsers, FaHome, 
  FaBell 
} from "react-icons/fa";

export default function Navbar() {
  const accent = "#E0B6F5";
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("id");

  const [showNotifications, setShowNotifications] = useState(false);
  const [profilePic, setProfilePic] = useState("");
  const [userName, setUserName] = useState("");
  const notificationRef = useRef(null);

  const [notifications] = useState([
    { id: 1, text: "New wellness challenge unlocked!", time: "2m ago" },
    { id: 2, text: "You completed your morning meditation goal!", time: "1h ago" },
    { id: 3, text: "Your current streak: 7 days! Keep it up 💪", time: "Today" },
  ]);

  const handleLogout = () => {
    localStorage.removeItem("id");
    localStorage.removeItem("token");
    localStorage.removeItem("userProfile");
    localStorage.removeItem("username");
    navigate("/");
  };

  // 🧩 Fetch user data from API and update localStorage + state
  const getUser = async () => {
    const userId = localStorage.getItem("id");
    const token = localStorage.getItem("token");
    if (!userId || !token) return;

    try {
      const res = await fetch(`https://my-habit-4.onrender.com/users/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.warn("Failed to fetch user data");
        return;
      }

      const data = await res.json();
      console.log( " djsksjajhdsajhkd" ,data)
      if (data) {
        // Store user info
        localStorage.setItem("userProfile", JSON.stringify(data));
        localStorage.setItem("username", data.user.name || "");

        // Format profile picture URL
        let imageUrl = "";
        if (data.user.profilePicture) {
          imageUrl = data.user.profilePicture;
          if (!imageUrl.startsWith("http")) {
            imageUrl = `https://my-habit-4.onrender.com/${imageUrl.replace(/^\//, "")}`;
          }
        }

        // Update states
        setUserName(data.user.name || "");
        setProfilePic(imageUrl || "");
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  // 🧠 Load user data when Navbar mounts or localStorage changes
  useEffect(() => {
    if (isLoggedIn) getUser();

    const handleStorageChange = () => {
      if (isLoggedIn) getUser();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [isLoggedIn]);

  // 🧭 Close notification panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <FaHeartbeat className="text-2xl" style={{ color: accent }} />
            <Link to="/" className="text-xl font-bold text-gray-900">
              WellnessTracker
            </Link>
          </motion.div>

          {/* Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-purple-600 font-medium flex items-center space-x-1">
              <FaHome className="text-sm" />
              <span>Home</span>
            </Link>
            
            {isLoggedIn ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-purple-600 font-medium flex items-center space-x-1">
                  <FaChartLine className="text-sm" />
                  <span>Dashboard</span>
                </Link>
                <Link to="/analytics" className="text-gray-700 hover:text-purple-600 font-medium flex items-center space-x-1">
                  <FaChartLine className="text-sm" />
                  <span>Analytics</span>
                </Link>
                <Link to="/community" className="text-gray-700 hover:text-purple-600 font-medium flex items-center space-x-1">
                  <FaUsers className="text-sm" />
                  <span>Community</span>
                </Link>
              </>
            ) : (
              <>
                <Link to="/features" className="text-gray-700 hover:text-purple-600 font-medium">
                  Features
                </Link>
                <Link to="/about" className="text-gray-700 hover:text-purple-600 font-medium">
                  About
                </Link>
              </>
            )}
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                {/* 🔔 Notifications */}
                <div className="relative" ref={notificationRef}>
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative text-gray-700 hover:text-purple-600"
                  >
                    <FaBell className="text-xl" />
                    {notifications.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-[#E0B6F5] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                        {notifications.length}
                      </span>
                    )}
                  </button>

                  <AnimatePresence>
                    {showNotifications && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-3 w-72 bg-white border border-gray-200 rounded-xl shadow-lg z-50 p-4"
                      >
                        <h3 className="font-semibold text-gray-800 mb-2">Notifications</h3>
                        {notifications.length > 0 ? (
                          <div className="space-y-2 max-h-60 overflow-y-auto">
                            {notifications.map((note) => (
                              <div key={note.id} className="bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition">
                                <p className="text-sm text-gray-700">{note.text}</p>
                                <span className="text-xs text-gray-500">{note.time}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-sm">No new notifications</p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 👤 Profile */}
                <Link 
                  to="/profile" 
                  className="flex items-center space-x-2 text-gray-700 hover:text-purple-600"
                >
                  {profilePic ? (
                    <img
                      src={profilePic}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover border-2 border-[#E0B6F5]"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "";
                        setProfilePic("");
                      }}
                    />
                  ) : (
                    <FaUserCircle className="text-2xl" />
                  )}
                  <span className="hidden sm:block font-medium">
                    {userName || "Profile"}
                  </span>
                </Link>

                {/* 🚪 Logout */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-full text-white font-medium"
                  style={{ backgroundColor: accent }}
                >
                  Logout
                </motion.button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-purple-600 font-medium"
                >
                  Login
                </Link>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/signup")}
                  className="px-4 py-2 rounded-full text-white font-medium"
                  style={{ backgroundColor: accent }}
                >
                  Sign Up
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
