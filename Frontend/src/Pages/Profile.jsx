import React, { useState, useEffect } from 'react';

// React Icons
import {
    FaUser,
    FaEnvelope,
    FaPhone,
    FaEdit,
    FaTrophy,
    FaFire,
    FaChartLine,
    FaCamera,
    FaTimes
} from 'react-icons/fa';

const Profile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [uploading, setUploading] = useState(false);

    // State management
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        contact: "",
        goal: "",
        profilePicture: ""
    });

    const [editData, setEditData] = useState({
        name: "",
        email: "",
        contact: "",
        goal: ""
    });

    const [wellnessStats, setWellnessStats] = useState({
        totalHabits: 0,
        currentStreak: 0,
        longestStreak: 0,
        completedHabits: 0,
        totalGoals: 0,
        completedGoals: 0
    });

    // Fetch user profile data
    const fetchUserProfile = async () => {
        console.log("🟢 Starting to fetch user profile...");
        setLoading(true);
        setError(null);

        try {
            const userId = localStorage.getItem("id");
            const token = localStorage.getItem("token");

            if (!userId || !token) {
                throw new Error("No user ID or token found. Please login again.");
            }

            console.log("🟢 Fetching profile for user:", userId);

            // Fetch user profile
            const profileResponse = await fetch(`https://my-habit-4.onrender.com/users/${userId}`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!profileResponse.ok) {
                throw new Error(`Failed to fetch profile: ${profileResponse.status}`);
            }

            const profileData = await profileResponse.json();
            console.log("🟢 Profile API Response:", profileData);

            // Fetch wellness stats
            let statsData = {};
            try {
                const statsResponse = await fetch(`https://my-habit-4.onrender.com/users/${userId}/stats`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });

                if (statsResponse.ok) {
                    statsData = await statsResponse.json();
                    console.log("🟢 Stats API Response:", statsData);
                } else {
                    console.log("🟡 Stats endpoint not available, using defaults");
                }
            } catch (statsError) {
                console.log("🟡 Stats fetch failed, using defaults:", statsError);
            }

            // Update state with API data - handle different response structures
            const updatedUserData = {
                name: profileData.user.name || profileData.username || "User",
                email: profileData.user.email || "No email provided",
                contact: profileData.user.contact || profileData.phone || "No contact provided",
                goal: profileData.user.goal || profileData.wellnessGoal || "Stay consistent with wellness habits",
                profilePicture: profileData.user.profilePicture || profileData.avatar || ""
            };

            console.log("🟢 Updated User Data:", updatedUserData);

            setUserData(updatedUserData);
            setEditData(updatedUserData);

            // Handle different stat response structures
            setWellnessStats({
                totalHabits: statsData.totalHabits || statsData.habitsTotal || 0,
                currentStreak: statsData.currentStreak || statsData.streakCurrent || 0,
                longestStreak: statsData.longestStreak || statsData.streakLongest || 0,
                completedHabits: statsData.completedHabits || statsData.habitsCompleted || 0,
                totalGoals: statsData.totalGoals || statsData.goalsTotal || 0,
                completedGoals: statsData.completedGoals || statsData.goalsCompleted || 0
            });

        } catch (err) {
            console.error("🔴 Error fetching profile:", err);
            setError(err.message || "Failed to load profile data");
        } finally {
            setLoading(false);
        }
    };

    // Update user profile
    const updateUserProfile = async () => {
        setLoading(true);
        setError(null);

        try {
            const userId = localStorage.getItem("id");
            const token = localStorage.getItem("token");

            const response = await fetch(`https://my-habit-4.onrender.com/users/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(editData),
            });

            if (!response.ok) {
                throw new Error(`Failed to update: ${response.status}`);
            }

            const data = await response.json();
            console.log("🟢 Update response:", data);

            // Update local state
            setUserData({ ...editData });
            setIsEditing(false);
            setError("Profile updated successfully!");

        } catch (err) {
            console.error("🔴 Error updating profile:", err);
            setError(err.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    // Upload profile picture
    const uploadProfilePicture = async (file) => {
        setUploading(true);
        setError(null);

        try {
            const userId = localStorage.getItem("id");
            const token = localStorage.getItem("token");

            const formData = new FormData();
            formData.append('profilePicture', file);

            console.log("🟢 Uploading profile picture...", file);

            const response = await fetch(`https://my-habit-4.onrender.com/users/${userId}/upload`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Upload failed: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            console.log("🟢 Upload response:", data);

            // Update local state with new profile picture
            // Handle different response structures
            const newProfilePicture = data.profilePicture || data.imageUrl || data.avatar;
            setUserData(prev => ({
                ...prev,
                profilePicture: newProfilePicture
            }));

            // Refresh the profile to get updated data
            fetchUserProfile();

            setError("Profile picture updated successfully!");

        } catch (err) {
            console.error("🔴 Error uploading picture:", err);
            setError(err.message || "Failed to upload profile picture");
        } finally {
            setUploading(false);
        }
    };

    // Handle file input change
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        console.log("🟢 File selected:", file);

        if (file) {
            // Validate file type and size
            if (!file.type.startsWith('image/')) {
                setError("Please select an image file (JPEG, PNG, etc.)");
                return;
            }

            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setError("Image size should be less than 5MB");
                return;
            }

            uploadProfilePicture(file);
        }

        // Reset the input to allow selecting the same file again
        e.target.value = '';
    };

    // Handle edit button click
    const handleEdit = () => {
        setEditData({ ...userData });
        setIsEditing(true);
        setError(null);
    };

    // Handle save button click
    const handleSave = async (e) => {
        e.preventDefault();

        // Simple validation
        if (!editData.name.trim()) {
            setError("Name is required");
            return;
        }

        if (!editData.email.trim()) {
            setError("Email is required");
            return;
        }

        await updateUserProfile();
    };

    // Handle cancel button click
    const handleCancel = () => {
        setEditData({ ...userData });
        setIsEditing(false);
        setError(null);
    };

    // Handle input changes
    const handleInputChange = (field, value) => {
        setEditData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Calculate completion percentage
    const getCompletionPercentage = () => {
        if (wellnessStats.totalHabits === 0) return 0;
        return Math.round((wellnessStats.completedHabits / wellnessStats.totalHabits) * 100);
    };

    // Get profile picture URL
    // Get profile picture URL - FIXED VERSION
    const getProfilePictureUrl = () => {
        if (!userData.profilePicture) {
            console.log("🟡 No profile picture in userData");
            return null;
        }

        console.log("🟢 Profile picture path:", userData.profilePicture);

        // If it's already a full URL, return as is
        if (userData.profilePicture.startsWith('http')) {
            console.log("🟢 Full URL detected:", userData.profilePicture);
            return userData.profilePicture;
        }

        // If it starts with uploads/ (without slash), construct the full URL
        if (userData.profilePicture.startsWith('uploads/')) {
            const fullUrl = `https://my-habit-4.onrender.com/${userData.profilePicture}`;
            console.log("🟢 Constructed URL from uploads/:", fullUrl);
            return fullUrl;
        }

        // If it starts with /uploads, construct the full URL
        if (userData.profilePicture.startsWith('/uploads')) {
            const fullUrl = `http://localhost:4300${userData.profilePicture}`;
            console.log("🟢 Constructed URL from /uploads:", fullUrl);
            return fullUrl;
        }

        // If it's just a filename, construct the path
        const fullUrl = `https://my-habit-4.onrender.com/uploads/${userData.profilePicture}`;
        console.log("🟢 Constructed URL from filename:", fullUrl);
        return fullUrl;
    };

    // Load profile data on component mount
    useEffect(() => {
        fetchUserProfile();
    }, []);

    // Show loading state
    if (loading && !userData.name) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#f8f4ff] to-[#f0e5ff] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e0b6f5] mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f8f4ff] to-[#f0e5ff] text-gray-900 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">

                {/* Error Message */}
                {error && (
                    <div className={`mb-6 ${error.includes('successfully') ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700'} px-4 py-3 rounded-lg`}>
                        <div className="flex justify-between items-center">
                            <span>{error}</span>
                            <button
                                onClick={() => setError(null)}
                                className={`${error.includes('successfully') ? 'text-green-700 hover:text-green-900' : 'text-red-700 hover:text-red-900'} font-bold text-lg`}
                            >
                                <FaTimes />
                            </button>
                        </div>
                    </div>
                )}

                {/* Page Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                        My Profile
                    </h1>
                    {!isEditing && (
                        <button
                            onClick={handleEdit}
                            disabled={loading}
                            className="flex items-center space-x-2 px-6 py-3 rounded-lg bg-[#e0b6f5] hover:bg-[#d1a7f0] transition-colors font-semibold text-white shadow-lg w-full sm:w-auto justify-center"
                        >
                            <FaEdit />
                            <span>Edit Profile</span>
                        </button>
                    )}
                </div>

                {/* Profile Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left Column - User Info */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Profile Picture Section */}
                        <section className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center">
                            <div className="relative">
                                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-[#e0b6f5] to-[#d1a7f0] flex items-center justify-center font-bold text-4xl text-white shadow-lg mb-4 overflow-hidden">
                                    {getProfilePictureUrl() ? (
                                        <img
                                            src={getProfilePictureUrl()}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                console.error("🔴 Image failed to load:", getProfilePictureUrl());
                                                // Hide the broken image and show fallback
                                                e.target.style.display = 'none';
                                                // You might want to set a state to show fallback permanently
                                            }}
                                            onLoad={() => console.log("🟢 Image loaded successfully:", getProfilePictureUrl())}
                                        />
                                    ) : null}

                                    {/* Fallback - show initial or placeholder */}
                                    {(!getProfilePictureUrl() || userData.profilePicture === "") && (
                                        <span className="text-2xl">{userData.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                                    )}
                                </div>

                                {/* Upload Button */}
                                <div className="absolute bottom-2 right-2">
                                    <label className="bg-[#e0b6f5] text-white p-3 rounded-full shadow-lg cursor-pointer hover:bg-[#d1a7f0] transition-colors block">
                                        <FaCamera className="text-sm" />
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            disabled={uploading}
                                        />
                                    </label>
                                </div>

                                {uploading && (
                                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                    </div>
                                )}
                            </div>

                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    className="w-full text-center bg-gray-100 rounded-lg px-4 py-2 mt-1 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#e0b6f5] text-xl font-bold border border-gray-300"
                                    placeholder="Enter your name"
                                />
                            ) : (
                                <h2 className="text-xl font-bold text-center">{userData.name || "User"}</h2>
                            )}
                            <p className="text-gray-600 text-center mt-2">Wellness Enthusiast</p>
                        </section>

                        {/* Contact Details Section */}
                        <section className="bg-white p-6 rounded-2xl shadow-lg space-y-6">
                            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Contact Details</h3>

                            <div className="space-y-4">
                                {/* Name Field */}
                                <div>
                                    <label className="text-sm font-medium text-gray-500 flex items-center space-x-2 mb-2">
                                        <FaUser className="text-[#e0b6f5]" />
                                        <span>Full Name</span>
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editData.name}
                                            onChange={(e) => handleInputChange('name', e.target.value)}
                                            className="w-full bg-gray-50 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#e0b6f5] border border-gray-300"
                                            placeholder="Enter your full name"
                                        />
                                    ) : (
                                        <p className="text-gray-900 p-3 bg-gray-50 rounded-lg min-h-[44px] flex items-center">
                                            {userData.name || "Not provided"}
                                        </p>
                                    )}
                                </div>

                                {/* Email Field */}
                                <div>
                                    <label className="text-sm font-medium text-gray-500 flex items-center space-x-2 mb-2">
                                        <FaEnvelope className="text-[#e0b6f5]" />
                                        <span>Email Address</span>
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            value={editData.email}
                                            onChange={(e) => handleInputChange('email', e.target.value)}
                                            className="w-full bg-gray-50 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#e0b6f5] border border-gray-300"
                                            placeholder="Enter your email"
                                        />
                                    ) : (
                                        <p className="text-gray-900 p-3 bg-gray-50 rounded-lg min-h-[44px] flex items-center">
                                            {userData.email || "No email provided"}
                                        </p>
                                    )}
                                </div>

                                {/* Contact Field */}
                                <div>
                                    <label className="text-sm font-medium text-gray-500 flex items-center space-x-2 mb-2">
                                        <FaPhone className="text-[#e0b6f5]" />
                                        <span>Contact Number</span>
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="tel"
                                            value={editData.contact}
                                            onChange={(e) => handleInputChange('contact', e.target.value)}
                                            className="w-full bg-gray-50 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#e0b6f5] border border-gray-300"
                                            placeholder="Enter your contact number"
                                        />
                                    ) : (
                                        <p className="text-gray-900 p-3 bg-gray-50 rounded-lg min-h-[44px] flex items-center">
                                            {userData.contact || "No contact provided"}
                                        </p>
                                    )}
                                </div>

                                {/* Goal Field */}
                                <div>
                                    <label className="text-sm font-medium text-gray-500 mb-2 block">
                                        Wellness Goal
                                    </label>
                                    {isEditing ? (
                                        <textarea
                                            value={editData.goal}
                                            onChange={(e) => handleInputChange('goal', e.target.value)}
                                            rows="3"
                                            className="w-full bg-gray-50 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#e0b6f5] border border-gray-300"
                                            placeholder="What's your wellness goal?"
                                        />
                                    ) : (
                                        <p className="text-gray-900 p-3 bg-gray-50 rounded-lg min-h-[60px]">
                                            {userData.goal || "Stay consistent with wellness habits"}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Edit Mode Buttons */}
                            {isEditing && (
                                <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-4 border-t">
                                    <button
                                        onClick={handleCancel}
                                        disabled={loading}
                                        className="flex-1 px-4 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors font-semibold text-gray-800 disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={loading}
                                        className="flex-1 px-4 py-3 rounded-lg bg-[#e0b6f5] hover:bg-[#d1a7f0] transition-colors font-semibold text-white disabled:opacity-50"
                                    >
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            )}
                        </section>
                    </div>

                    {/* Right Column - Stats */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Wellness Stats */}
                        <section className="bg-white p-6 rounded-2xl shadow-lg">
                            <h3 className="text-lg font-semibold text-gray-800 mb-6">Wellness Statistics</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div className="bg-gradient-to-br from-[#f8f4ff] to-[#f0e5ff] p-4 rounded-xl text-center border border-[#e0b6f5]">
                                    <FaTrophy className="mx-auto text-[#e0b6f5] h-6 w-6 mb-2" />
                                    <p className="text-xl font-bold text-gray-800">{wellnessStats.totalHabits}</p>
                                    <p className="text-xs text-gray-600 mt-1">Total Habits</p>
                                </div>
                                <div className="bg-gradient-to-br from-[#f8f4ff] to-[#f0e5ff] p-4 rounded-xl text-center border border-[#e0b6f5]">
                                    <FaFire className="mx-auto text-[#e0b6f5] h-6 w-6 mb-2" />
                                    <p className="text-xl font-bold text-gray-800">{wellnessStats.currentStreak}</p>
                                    <p className="text-xs text-gray-600 mt-1">Current Streak</p>
                                </div>
                                <div className="bg-gradient-to-br from-[#f8f4ff] to-[#f0e5ff] p-4 rounded-xl text-center border border-[#e0b6f5]">
                                    <FaChartLine className="mx-auto text-[#e0b6f5] h-6 w-6 mb-2" />
                                    <p className="text-xl font-bold text-gray-800">{wellnessStats.longestStreak}</p>
                                    <p className="text-xs text-gray-600 mt-1">Longest Streak</p>
                                </div>
                                <div className="bg-gradient-to-br from-[#f8f4ff] to-[#f0e5ff] p-4 rounded-xl text-center border border-[#e0b6f5]">
                                    <div className="mx-auto text-[#e0b6f5] h-6 w-6 mb-2 flex items-center justify-center text-lg font-bold">
                                        {getCompletionPercentage()}%
                                    </div>
                                    <p className="text-xl font-bold text-gray-800">{wellnessStats.completedHabits}</p>
                                    <p className="text-xs text-gray-600 mt-1">Completed Habits</p>
                                </div>
                                <div className="bg-gradient-to-br from-[#f8f4ff] to-[#f0e5ff] p-4 rounded-xl text-center border border-[#e0b6f5]">
                                    <FaTrophy className="mx-auto text-[#e0b6f5] h-6 w-6 mb-2" />
                                    <p className="text-xl font-bold text-gray-800">{wellnessStats.totalGoals}</p>
                                    <p className="text-xs text-gray-600 mt-1">Total Goals</p>
                                </div>
                                <div className="bg-gradient-to-br from-[#f8f4ff] to-[#f0e5ff] p-4 rounded-xl text-center border border-[#e0b6f5]">
                                    <div className="mx-auto text-[#e0b6f5] h-6 w-6 mb-2 flex items-center justify-center">
                                        ✅
                                    </div>
                                    <p className="text-xl font-bold text-gray-800">{wellnessStats.completedGoals}</p>
                                    <p className="text-xs text-gray-600 mt-1">Completed Goals</p>
                                </div>
                            </div>
                        </section>

                        {/* Progress Overview */}
                        <section className="bg-white p-6 rounded-2xl shadow-lg">
                            <h3 className="text-lg font-semibold text-gray-800 mb-6">Progress Overview</h3>
                            <div className="space-y-4">
                                {/* Habit Completion Progress */}
                                <div>
                                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                                        <span>Habit Completion</span>
                                        <span>{getCompletionPercentage()}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                        <div
                                            className="bg-[#e0b6f5] h-3 rounded-full transition-all duration-500"
                                            style={{ width: `${getCompletionPercentage()}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Goal Completion Progress */}
                                <div>
                                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                                        <span>Goal Completion</span>
                                        <span>{wellnessStats.totalGoals > 0 ? Math.round((wellnessStats.completedGoals / wellnessStats.totalGoals) * 100) : 0}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                        <div
                                            className="bg-[#e0b6f5] h-3 rounded-full transition-all duration-500"
                                            style={{ width: `${wellnessStats.totalGoals > 0 ? Math.round((wellnessStats.completedGoals / wellnessStats.totalGoals) * 100) : 0}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Recent Activity */}
                        <section className="bg-white p-6 rounded-2xl shadow-lg">
                            <h3 className="text-lg font-semibold text-gray-800 mb-6">Recent Activity</h3>
                            {wellnessStats.completedHabits > 0 || wellnessStats.currentStreak > 0 ? (
                                <div className="space-y-3">
                                    {wellnessStats.completedHabits > 0 && (
                                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                            <span className="text-gray-700 font-medium">Completed {wellnessStats.completedHabits} habits today</span>
                                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">Today</span>
                                        </div>
                                    )}
                                    {wellnessStats.currentStreak > 0 && (
                                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                            <span className="text-gray-700 font-medium">Current streak: {wellnessStats.currentStreak} days</span>
                                            <span className="px-3 py-1 bg-[#e0b6f5] text-white rounded-full text-sm font-semibold">Active</span>
                                        </div>
                                    )}
                                    {wellnessStats.completedGoals > 0 && (
                                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                            <span className="text-gray-700 font-medium">Completed {wellnessStats.completedGoals} goals</span>
                                            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">Achievement</span>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <p>No recent activity. Start tracking your habits to see progress here!</p>
                                </div>
                            )}
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;