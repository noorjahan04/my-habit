// HabitTracker.js
import React, { useState, createContext, useContext, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  FaCheck, 
  FaTimes, 
  FaPlus, 
  FaCog, 
  FaEdit, 
  FaComment,
  FaWifi,
  FaCrown,
  FaFire,
  FaTrophy,
  FaCalendar,
  FaStar,
  FaChevronRight,
  FaLeaf,
  FaRunning,
  FaBook,
  FaWater,
  FaSun,
  FaMoon,
  FaUtensils,
  FaBed,
  FaLaptop,
  FaMusic,
  FaHeart,
  FaDumbbell,
  FaTrash,
  FaSpinner
} from 'react-icons/fa';

// Create Context to avoid prop drilling
const HabitContext = createContext();

// Custom hook to use habit context
export const useHabit = () => {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error('useHabit must be used within a HabitProvider');
  }
  return context;
};

// Available habit icons and colors
const HABIT_ICONS = [
  { icon: FaLeaf, name: 'Leaf', color: 'from-green-400 to-emerald-500' },
  { icon: FaRunning, name: 'Running', color: 'from-blue-400 to-cyan-500' },
  { icon: FaBook, name: 'Book', color: 'from-purple-400 to-indigo-500' },
  { icon: FaWater, name: 'Water', color: 'from-sky-400 to-blue-500' },
  { icon: FaSun, name: 'Sun', color: 'from-yellow-400 to-orange-500' },
  { icon: FaMoon, name: 'Moon', color: 'from-indigo-400 to-purple-500' },
  { icon: FaUtensils, name: 'Food', color: 'from-red-400 to-pink-500' },
  { icon: FaBed, name: 'Sleep', color: 'from-blue-400 to-indigo-500' },
  { icon: FaLaptop, name: 'Work', color: 'from-gray-400 to-gray-600' },
  { icon: FaMusic, name: 'Music', color: 'from-pink-400 to-rose-500' },
  { icon: FaHeart, name: 'Health', color: 'from-red-400 to-red-500' },
  { icon: FaDumbbell, name: 'Gym', color: 'from-orange-400 to-red-500' }
];

const FREQUENCY_OPTIONS = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'weekdays', label: 'Weekdays Only' },
  { value: 'weekends', label: 'Weekends Only' }
];

const CATEGORY_OPTIONS = [
  'Health & Fitness',
  'Personal Development',
  'Productivity',
  'Mental Health',
  'Relationships',
  'Finance',
  'Learning',
  'Creativity',
  'Other'
];

// API Service functions (same structure as your login)
const createHabitAPI = async (habitData) => {
  const token = localStorage.getItem('token');
  
  try {
    const response = await fetch("https://my-habit-4.onrender.com/habit/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(habitData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to create habit");
    }
    
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const getHabitsAPI = async () => {
  const token = localStorage.getItem('token');
  
  try {
    const response = await fetch("https://my-habit-4.onrender.com/habit/get", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      },
    });

    const data = await response.json();
    console.log(data)
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch habits");
    }
    
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const completeHabitAPI = async (habitId) => {
  const token = localStorage.getItem('token');
  
  try {
    const response = await fetch(`https://my-habit-4.onrender.com/habit/${habitId}/complete`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to complete habit");
    }
    
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const deleteHabitAPI = async (habitId) => {
  const token = localStorage.getItem('token');
  
  try {
    const response = await fetch(`https://my-habit-4.onrender.com/habit/${habitId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to delete habit");
    }
    
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const HabitTracker = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(false);
  const [freeCredits] = useState(3);
  const [activeTab, setActiveTab] = useState('habits');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newHabit, setNewHabit] = useState({
    name: '',
    description: '',
    frequency: 'daily',
    category: 'Health & Fitness',
    icon: FaLeaf,
    color: 'from-green-400 to-emerald-500',
    reminderTime: '',
    goal: '',
    priority: 'medium',
    timesPerDay: 1
  });
  const [stats, setStats] = useState({
    completedToday: 0,
    currentStreak: 0,
    totalHabits: 0
  });

  // Load habits from backend on component mount
  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = async () => {
    try {
      setLoading(true);
      const habitsData = await getHabitsAPI();
      
      // Transform backend data to frontend format
      const transformedHabits = habitsData.map(habit => ({
        id: habit._id,
        name: habit.name,
        completed: habit.lastCompleted ? isToday(new Date(habit.lastCompleted)) : false,
        streak: habit.streak || 0,
        icon: getIconFromCategory(habit.category),
        color: getColorFromCategory(habit.category),
        description: habit.description || '',
        frequency: habit.frequency || 'daily',
        category: habit.category,
        reminderTime: habit.reminderTime || '',
        goal: habit.goal || '',
        priority: habit.priority || 'medium',
        timesPerDay: habit.timesPerDay || 1
      }));

      setHabits(transformedHabits);
      updateStats(transformedHabits);
      setConnectionError(false);
    } catch (error) {
      console.error('Failed to load habits:', error);
      setConnectionError(true);
      toast.error('Failed to load habits. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const getIconFromCategory = (category) => {
    const iconMap = {
      'Health & Fitness': FaRunning,
      'Personal Development': FaBook,
      'Productivity': FaLaptop,
      'Mental Health': FaLeaf,
      'Relationships': FaHeart,
      'Finance': FaDumbbell,
      'Learning': FaBook,
      'Creativity': FaMusic,
      'Other': FaStar
    };
    return iconMap[category] || FaStar;
  };

  const getColorFromCategory = (category) => {
    const colorMap = {
      'Health & Fitness': 'from-green-400 to-emerald-500',
      'Personal Development': 'from-blue-400 to-cyan-500',
      'Productivity': 'from-purple-400 to-indigo-500',
      'Mental Health': 'from-pink-400 to-rose-500',
      'Relationships': 'from-red-400 to-red-500',
      'Finance': 'from-yellow-400 to-orange-500',
      'Learning': 'from-indigo-400 to-purple-500',
      'Creativity': 'from-pink-400 to-rose-500',
      'Other': 'from-gray-400 to-gray-600'
    };
    return colorMap[category] || 'from-gray-400 to-gray-600';
  };

  const updateStats = (habitsList) => {
    const completedToday = habitsList.filter(habit => habit.completed).length;
    const currentStreak = Math.max(...habitsList.map(habit => habit.streak), 0);
    const totalHabits = habitsList.length;

    setStats({
      completedToday,
      currentStreak,
      totalHabits
    });
  };

  const toggleHabit = async (id) => {
    try {
      const response = await completeHabitAPI(id);
      
      // Update local state
      setHabits(prevHabits => 
        prevHabits.map(habit => 
          habit.id === id 
            ? { 
                ...habit, 
                completed: !habit.completed,
                streak: response.streak
              } 
            : habit
        )
      );

      // Update stats
      setStats(prev => ({
        ...prev,
        completedToday: prev.completedToday + (habits.find(h => h.id === id).completed ? -1 : 1)
      }));

      toast.success(`🎉 Habit ${habits.find(h => h.id === id).completed ? 'uncompleted' : 'completed'}!`, {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error('Failed to toggle habit:', error);
      toast.error('Failed to update habit. Please try again.');
    }
  };

  const createHabit = async () => {
    if (!newHabit.name.trim()) {
      toast.error('Please enter a habit name');
      return;
    }

    try {
      // Prepare data for backend
      const habitData = {
        name: newHabit.name,
        category: newHabit.category,
        frequency: newHabit.frequency,
        timesPerDay: newHabit.timesPerDay,
        reminderTime: newHabit.reminderTime,
        description: newHabit.description,
        goal: newHabit.goal,
        priority: newHabit.priority
      };

      const response = await createHabitAPI(habitData);
      
      // Add new habit to local state
      const newHabitWithId = {
        id: response.habit._id,
        name: response.habit.name,
        completed: false,
        streak: 0,
        icon: newHabit.icon,
        color: newHabit.color,
        description: newHabit.description,
        frequency: newHabit.frequency,
        category: newHabit.category,
        reminderTime: newHabit.reminderTime,
        goal: newHabit.goal,
        priority: newHabit.priority,
        timesPerDay: newHabit.timesPerDay
      };

      setHabits(prev => [...prev, newHabitWithId]);
      
      // Reset form
      setNewHabit({
        name: '',
        description: '',
        frequency: 'daily',
        category: 'Health & Fitness',
        icon: FaLeaf,
        color: 'from-green-400 to-emerald-500',
        reminderTime: '',
        goal: '',
        priority: 'medium',
        timesPerDay: 1
      });
      
      setShowCreateModal(false);
      
      toast.success('New habit created! 🚀', {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      console.error('Failed to create habit:', error);
      toast.error('Failed to create habit. Please try again.');
    }
  };

  const deleteHabit = async (id) => {
    if (!window.confirm('Are you sure you want to delete this habit?')) {
      return;
    }

    try {
      await deleteHabitAPI(id);
      
      // Remove from local state
      setHabits(prev => prev.filter(habit => habit.id !== id));
      
      toast.success('Habit deleted successfully', {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      console.error('Failed to delete habit:', error);
      toast.error('Failed to delete habit. Please try again.');
    }
  };

  const updateNewHabit = (field, value) => {
    setNewHabit(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const retryConnection = () => {
    loadHabits();
    toast.info('Retrying connection...', {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const contextValue = {
    habits,
    toggleHabit,
    createHabit,
    deleteHabit,
    connectionError,
    retryConnection,
    freeCredits,
    activeTab,
    setActiveTab,
    showCreateModal,
    setShowCreateModal,
    newHabit,
    updateNewHabit,
    stats,
    loading
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="text-4xl text-[#e0b6f5] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your habits...</p>
        </div>
      </div>
    );
  }

  return (
    <HabitContext.Provider value={contextValue}>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Header />
          <StatsSection />
          <ConnectionStatus />
          <MainContent />
          <BottomNavigation />
        </div>
        
        {/* Create Habit Modal */}
        {showCreateModal && <CreateHabitModal />}
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </HabitContext.Provider>
  );
};

// Header Component
const Header = () => {
  const { setShowCreateModal, freeCredits } = useHabit();

  return (
    <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
      <div className="mb-6 lg:mb-0">
        <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-3">
          Habit Tracker
        </h1>
        <p className="text-gray-600 text-lg">Build better habits, one day at a time</p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
        <button 
          onClick={() => setShowCreateModal(true)}
          className="group bg-gradient-to-r from-[#e0b6f5] to-[#d19ef0] text-white px-6 py-4 rounded-2xl font-semibold flex items-center justify-center gap-3 hover:shadow-2xl hover:scale-105 transition-all duration-300 shadow-lg"
        >
          <FaPlus className="text-lg group-hover:rotate-90 transition-transform duration-300" />
          <span>Create Habit</span>
        </button>
        
        <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 flex items-center gap-3">
          <FaCrown className="text-yellow-500 text-xl" />
          <div>
            <div className="text-sm text-gray-500">Free Credits</div>
            <div className="font-semibold text-gray-800">{freeCredits} remaining</div>
          </div>
        </div>
      </div>
    </header>
  );
};

// Stats Section Component
const StatsSection = () => {
  const { stats } = useHabit();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-gray-800">{stats.completedToday}</div>
            <div className="text-gray-500 text-sm">Completed Today</div>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <FaCheck className="text-white text-lg" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-gray-800">{stats.currentStreak}</div>
            <div className="text-gray-500 text-sm">Current Streak</div>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <FaFire className="text-white text-lg" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-gray-800">{stats.totalHabits}</div>
            <div className="text-gray-500 text-sm">Total Habits</div>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <FaTrophy className="text-white text-lg" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Connection Status Component
const ConnectionStatus = () => {
  const { connectionError, retryConnection } = useHabit();
  
  if (!connectionError) return null;
  
  return (
    <div className="mb-8">
      <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl p-6 shadow-lg animate-fade-in">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <FaWifi className="text-red-500 text-xl animate-pulse" />
            </div>
            <div>
              <h3 className="text-red-600 font-semibold text-lg mb-1">Connection Error</h3>
              <p className="text-red-500">Failed to fetch data from server</p>
            </div>
          </div>
          <button 
            className="bg-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-600 transition-all duration-300 hover:scale-105 shadow-md whitespace-nowrap"
            onClick={retryConnection}
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Content Component
const MainContent = () => {
  const { habits, toggleHabit, deleteHabit, setShowCreateModal, loading } = useHabit();
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <FaSpinner className="text-2xl text-[#e0b6f5] animate-spin" />
      </div>
    );
  }

  return (
    <main className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Today's Habits</h2>
        <div className="flex items-center gap-2 text-gray-500">
          <FaCalendar className="text-[#e0b6f5]" />
          <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {habits.map(habit => {
          const IconComponent = habit.icon;
          return (
            <div 
              key={habit.id} 
              className="group bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:scale-105"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 bg-gradient-to-br ${habit.color} rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300`}>
                    <IconComponent className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-lg">{habit.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <FaFire className="text-orange-500" />
                      <span>{habit.streak} day streak</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-md ${
                      habit.completed 
                        ? `bg-gradient-to-br ${habit.color} text-white` 
                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                    }`}
                    onClick={() => toggleHabit(habit.id)}
                  >
                    {habit.completed ? <FaCheck className="text-lg" /> : <FaTimes className="text-lg" />}
                  </button>
                  <button
                    className="w-10 h-10 rounded-2xl flex items-center justify-center bg-red-100 text-red-500 hover:bg-red-200 transition-all duration-300 hover:scale-110"
                    onClick={() => deleteHabit(habit.id)}
                    title="Delete habit"
                  >
                    <FaTrash className="text-sm" />
                  </button>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className={`w-2 h-2 rounded-full ${habit.completed ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  {habit.completed ? 'Completed' : 'Pending'}
                </div>
                <div className="text-xs text-gray-400">
                  {habit.frequency} • {habit.category}
                </div>
              </div>
            </div>
          );
        })}
        
        {/* Add New Habit Card */}
        <div 
          className="group bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border-2 border-dashed border-gray-300 hover:border-[#e0b6f5] hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 transition-all duration-500 cursor-pointer flex flex-col items-center justify-center min-h-[160px] text-center"
          onClick={() => setShowCreateModal(true)}
        >
          <div className="w-14 h-14 bg-gradient-to-br from-[#e0b6f5] to-[#d19ef0] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
            <FaPlus className="text-white text-xl" />
          </div>
          <p className="text-gray-600 font-medium">Add New Habit</p>
          <p className="text-gray-400 text-sm mt-1">Click to create a new habit</p>
        </div>
      </div>
    </main>
  );
};

// Bottom Navigation Component
const BottomNavigation = () => {
  const { activeTab, setActiveTab } = useHabit();
  
  return (
    <nav className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200 p-2">
      <div className="flex gap-1">
        <button 
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
            activeTab === 'edit' 
              ? 'bg-gradient-to-r from-[#e0b6f5] to-[#d19ef0] text-white shadow-lg' 
              : 'text-gray-600 hover:text-[#e0b6f5] hover:bg-gray-100'
          }`}
          onClick={() => setActiveTab('edit')}
        >
          <FaEdit className="text-sm" />
          <span>Edit</span>
        </button>
        <button 
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
            activeTab === 'chat' 
              ? 'bg-gradient-to-r from-[#e0b6f5] to-[#d19ef0] text-white shadow-lg' 
              : 'text-gray-600 hover:text-[#e0b6f5] hover:bg-gray-100'
          }`}
          onClick={() => setActiveTab('chat')}
        >
          <FaComment className="text-sm" />
          <span>Chat</span>
        </button>
        <button 
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
            activeTab === 'settings' 
              ? 'bg-gradient-to-r from-[#e0b6f5] to-[#d19ef0] text-white shadow-lg' 
              : 'text-gray-600 hover:text-[#e0b6f5] hover:bg-gray-100'
          }`}
          onClick={() => setActiveTab('settings')}
        >
          <FaCog className="text-sm" />
          <span>Settings</span>
        </button>
      </div>
    </nav>
  );
};

// Create Habit Modal Component
const CreateHabitModal = () => {
  const { setShowCreateModal, newHabit, updateNewHabit, createHabit } = useHabit();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl animate-scale-in my-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Create New Habit</h2>
        <p className="text-gray-600 mb-8">Build a better you, one habit at a time</p>
        
        <div className="space-y-6 max-h-96 overflow-y-auto pr-4">
          {/* Habit Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Habit Name *
            </label>
            <input
              type="text"
              value={newHabit.name}
              onChange={(e) => updateNewHabit('name', e.target.value)}
              placeholder="e.g., Morning Meditation, Exercise, Read Book..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#e0b6f5] focus:border-transparent transition-all duration-300"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={newHabit.description}
              onChange={(e) => updateNewHabit('description', e.target.value)}
              placeholder="Describe your habit and why it's important..."
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#e0b6f5] focus:border-transparent transition-all duration-300 resize-none"
            />
          </div>

          {/* Category and Frequency */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={newHabit.category}
                onChange={(e) => updateNewHabit('category', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#e0b6f5] focus:border-transparent transition-all duration-300"
              >
                {CATEGORY_OPTIONS.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Frequency
              </label>
              <select
                value={newHabit.frequency}
                onChange={(e) => updateNewHabit('frequency', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#e0b6f5] focus:border-transparent transition-all duration-300"
              >
                {FREQUENCY_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Times Per Day */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Times Per Day
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={newHabit.timesPerDay}
              onChange={(e) => updateNewHabit('timesPerDay', parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#e0b6f5] focus:border-transparent transition-all duration-300"
            />
          </div>

          {/* Goal and Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Goal
              </label>
              <input
                type="text"
                value={newHabit.goal}
                onChange={(e) => updateNewHabit('goal', e.target.value)}
                placeholder="e.g., 30 minutes, 8 glasses, 10 pages..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#e0b6f5] focus:border-transparent transition-all duration-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={newHabit.priority}
                onChange={(e) => updateNewHabit('priority', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#e0b6f5] focus:border-transparent transition-all duration-300"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {/* Reminder Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reminder Time (Optional)
            </label>
            <input
              type="time"
              value={newHabit.reminderTime}
              onChange={(e) => updateNewHabit('reminderTime', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#e0b6f5] focus:border-transparent transition-all duration-300"
            />
          </div>
        </div>
        
        <div className="flex gap-3 pt-8 border-t border-gray-200 mt-6">
          <button
            onClick={() => setShowCreateModal(false)}
            className="flex-1 px-6 py-4 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-300"
          >
            Cancel
          </button>
          <button
            onClick={createHabit}
            disabled={!newHabit.name.trim()}
            className="flex-1 px-6 py-4 bg-gradient-to-r from-[#e0b6f5] to-[#d19ef0] text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Habit
          </button>
        </div>
      </div>
    </div>
  );
};

export default HabitTracker;