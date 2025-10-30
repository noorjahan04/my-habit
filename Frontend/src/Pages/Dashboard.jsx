import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import AiChat from './Chatboat';

// Mobile Header Component
const MobileHeader = ({ toggleSidebar, navigate, userData, onGoToLanding }) => {
  return (
    <div className="md:hidden bg-white shadow-2xl p-4 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center space-x-3">
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
        >
          <i className="fas fa-bars"></i>
        </button>
        <button 
          onClick={() => navigate('/overview')}
          className="flex items-center"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#e0b6f5] to-purple-500 flex items-center justify-center text-white font-bold shadow-lg">
            W
          </div>
        </button>
      </div>
      
      <div className="flex items-center space-x-3">
        <button 
          onClick={onGoToLanding}
          className="text-sm text-[#e0b6f5] font-semibold hover:text-purple-500 transition-colors bg-gray-100 px-3 py-1 rounded-lg shadow-sm"
        >
          Home
        </button>
        <div className="flex items-center bg-gray-100 px-2 py-1 rounded-lg shadow-sm">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-1"></div>
          <span className="text-xs text-gray-600">{userData.streak}d</span>
        </div>
      </div>
    </div>
  );
};

// Mobile Bottom Navigation
const MobileBottomNav = ({ activeSection, setActiveSection, navigate }) => {
  const menuItems = [
    { id: 'overview', icon: 'fa-chart-pie', label: 'Home' },
    { id: 'habits', icon: 'fa-list-check', label: 'Habits' },
    { id: 'goals', icon: 'fa-bullseye', label: 'Goals' },
    { id: 'profile', icon: 'fa-user', label: 'Profile' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-2xl z-50">
      <div className="flex justify-around items-center p-2">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => {
              setActiveSection(item.id);
              navigate(`/${item.id}`);
            }}
            className={`flex flex-col items-center p-2 rounded-xl transition-all duration-200 flex-1 mx-1 ${
              activeSection === item.id 
                ? 'text-[#e0b6f5] bg-gray-50 shadow-inner' 
                : 'text-gray-500 hover:text-[#e0b6f5]'
            }`}
          >
            <i className={`fas ${item.icon} text-lg mb-1`}></i>
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// Enhanced components for each section
const Overview = ({ userData, toggleHabit }) => {
  return (
    <div className="space-y-4 md:space-y-6 animate-fadeIn pb-20 md:pb-0">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 bg-gradient-to-r from-[#e0b6f5] to-purple-500 bg-clip-text text-transparent">
          Welcome back, {userData.name}!
        </h2>
        <p className="text-gray-600 mt-1 md:mt-2 text-sm md:text-base">Ready to continue your wellness journey today?</p>
      </div>
      <div className="flex items-center mt-3 md:mt-0">
        <div className="w-2 h-2 md:w-3 md:h-3 bg-green-400 rounded-full animate-pulse mr-2"></div>
        <span className="text-xs md:text-sm text-gray-600">Current streak: {userData.streak} days 🔥</span>
      </div>
      
      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 mt-4 md:mt-6">
        <div className="bg-white p-4 md:p-6 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-700 text-xs md:text-sm">STREAK</h3>
            <div className="w-8 h-8 md:w-10 md:h-10 bg-[#e0b6f5] rounded-full flex items-center justify-center shadow-lg">
              <i className="fas fa-fire text-white text-sm"></i>
            </div>
          </div>
          <p className="text-2xl md:text-4xl font-bold mt-3 text-[#e0b6f5]">{userData.streak}</p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-3 shadow-inner">
            <div 
              className="bg-[#e0b6f5] h-2 rounded-full transition-all duration-1000 shadow-lg" 
              style={{ width: `${Math.min((userData.streak / 30) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
        
        <div className="bg-white p-4 md:p-6 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-700 text-xs md:text-sm">HABITS</h3>
            <div className="w-8 h-8 md:w-10 md:h-10 bg-[#e0b6f5] rounded-full flex items-center justify-center shadow-lg">
              <i className="fas fa-list-check text-white text-sm"></i>
            </div>
          </div>
          <p className="text-2xl md:text-4xl font-bold mt-3 text-[#e0b6f5]">{userData.habits.length}</p>
          <p className="text-xs md:text-sm text-gray-500 mt-2">
            {userData.habits.filter(h => h.completed).length} completed today
          </p>
        </div>
        
        <div className="col-span-2 md:col-span-1 bg-white p-4 md:p-6 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-700 text-xs md:text-sm">GOALS</h3>
            <div className="w-8 h-8 md:w-10 md:h-10 bg-[#e0b6f5] rounded-full flex items-center justify-center shadow-lg">
              <i className="fas fa-bullseye text-white text-sm"></i>
            </div>
          </div>
          <p className="text-2xl md:text-4xl font-bold mt-3 text-[#e0b6f5]">{userData.goals.length}</p>
          <p className="text-xs md:text-sm text-gray-500 mt-2">
            Avg: {Math.round(userData.goals.reduce((acc, goal) => acc + goal.progress, 0) / userData.goals.length)}%
          </p>
        </div>
      </div>
      
      {/* Enhanced Today's Habits */}
      <div className="bg-white p-4 md:p-6 rounded-2xl shadow-2xl mt-4 md:mt-6">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h3 className="text-lg md:text-2xl font-bold text-gray-800">Today's Habits</h3>
          <div className="text-xs md:text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full shadow-inner">
            {userData.habits.filter(h => h.completed).length}/{userData.habits.length}
          </div>
        </div>
        <div className="space-y-3">
          {userData.habits.map((habit, index) => (
            <div 
              key={habit.id} 
              className="flex items-center justify-between p-3 md:p-4 rounded-xl bg-gray-50 hover:bg-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center flex-1 min-w-0">
                <button 
                  onClick={() => toggleHabit(habit.id)}
                  className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center mr-3 md:mr-4 transition-all duration-300 flex-shrink-0 shadow-lg ${
                    habit.completed 
                      ? 'bg-[#e0b6f5] text-white' 
                      : 'bg-white text-gray-400 hover:bg-[#e0b6f5] hover:text-white'
                  }`}
                >
                  {habit.completed && <i className="fas fa-check text-xs md:text-sm"></i>}
                </button>
                <div className="min-w-0 flex-1">
                  <span className={`text-sm md:text-lg font-medium truncate ${habit.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                    {habit.name}
                  </span>
                  <p className="text-xs md:text-sm text-gray-500 truncate">{habit.frequency}</p>
                </div>
              </div>
              {habit.completed && (
                <div className="text-green-500 animate-bounce ml-2 flex-shrink-0">
                  <i className="fas fa-check-circle text-sm md:text-base"></i>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions for Mobile */}
      <div className="md:hidden grid grid-cols-2 gap-3 mt-6">
        <button className="bg-[#e0b6f5] text-white p-3 rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
          <i className="fas fa-plus mr-2"></i>Add Habit
        </button>
        <button className="bg-white text-[#e0b6f5] p-3 rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
          <i className="fas fa-bullseye mr-2"></i>Set Goal
        </button>
      </div>
    </div>
  );
};

const HabitsPage = ({ userData, toggleHabit }) => {
  const [newHabit, setNewHabit] = useState('');

  const addHabit = () => {
    if (newHabit.trim()) {
      console.log('Adding new habit:', newHabit);
      setNewHabit('');
    }
  };

  return (
    <div className="animate-fadeIn pb-20 md:pb-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 bg-gradient-to-r from-[#e0b6f5] to-purple-500 bg-clip-text text-transparent">
          Your Habits
        </h2>
        <div className="flex mt-4 md:mt-0 w-full md:w-auto">
          <input 
            type="text" 
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            placeholder="Add a new habit..."
            className="flex-1 rounded-l-xl p-3 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#e0b6f5] transition-colors shadow-lg bg-white"
          />
          <button 
            onClick={addHabit}
            className="bg-[#e0b6f5] text-white px-4 md:px-6 rounded-r-xl hover:bg-purple-500 transition-colors shadow-lg hover:shadow-xl"
          >
            <i className="fas fa-plus"></i>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {userData.habits.map((habit, index) => (
          <div 
            key={habit.id} 
            className="bg-white p-4 md:p-6 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300"
          >
            <div className="flex justify-between items-center mb-3 md:mb-4">
              <h3 className="font-semibold text-gray-800 text-base md:text-lg truncate flex-1 mr-2">{habit.name}</h3>
              <button 
                onClick={() => toggleHabit(habit.id)}
                className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 shadow-lg ${
                  habit.completed 
                    ? 'bg-[#e0b6f5] text-white' 
                    : 'bg-gray-100 text-gray-400 hover:bg-[#e0b6f5] hover:text-white'
                }`}
              >
                {habit.completed && <i className="fas fa-check text-xs"></i>}
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-3 md:mb-4">Frequency: {habit.frequency}</p>
            <div className="flex justify-between items-center text-sm">
              <span className={`px-3 py-1 rounded-full text-xs shadow-inner ${
                habit.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {habit.completed ? 'Completed' : 'Pending'}
              </span>
              <button className="text-[#e0b6f5] hover:text-purple-500 transition-colors">
                <i className="fas fa-ellipsis-h"></i>
              </button>
            </div>
          </div>
        ))}
        
        {/* Add New Habit Card */}
        <div className="bg-gradient-to-br from-[#e0b6f5] to-purple-400 p-4 md:p-6 rounded-2xl shadow-2xl cursor-pointer transition-all duration-300 flex flex-col items-center justify-center min-h-[140px] md:min-h-[200px]">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 rounded-full flex items-center justify-center mb-3 md:mb-4 shadow-lg">
            <i className="fas fa-plus text-xl md:text-2xl text-white"></i>
          </div>
          <h3 className="text-white font-semibold text-base md:text-lg text-center">Add New Habit</h3>
          <p className="text-white/90 text-xs md:text-sm text-center mt-1">Start building new healthy routines</p>
        </div>
      </div>
    </div>
  );
};

const GoalsPage = ({ userData }) => {
  return (
    <div className="animate-fadeIn pb-20 md:pb-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 bg-gradient-to-r from-[#e0b6f5] to-purple-500 bg-clip-text text-transparent">
          Your Goals
        </h2>
        <button className="bg-[#e0b6f5] text-white px-4 py-3 md:px-6 md:py-3 rounded-xl hover:bg-purple-500 transition-colors mt-4 md:mt-0 text-sm md:text-base shadow-lg hover:shadow-xl w-full md:w-auto">
          <i className="fas fa-plus mr-2"></i>
          Set New Goal
        </button>
      </div>

      <div className="space-y-4 md:space-y-6">
        {userData.goals.map((goal, index) => (
          <div 
            key={goal.id} 
            className="bg-white p-4 md:p-6 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-3 md:mb-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800 text-lg md:text-xl truncate">{goal.name}</h3>
                <p className="text-gray-600 mt-1 text-sm md:text-base">Target: {goal.target}</p>
              </div>
              <span className="text-xl md:text-2xl font-bold text-[#e0b6f5] mt-2 md:mt-0 text-right">{goal.progress}%</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-3 md:h-4 mb-2 md:mb-3 shadow-inner">
              <div 
                className="bg-gradient-to-r from-[#e0b6f5] to-purple-500 h-3 md:h-4 rounded-full transition-all duration-1000 ease-out shadow-lg"
                style={{ width: `${goal.progress}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between text-sm text-gray-600">
              <span>Progress</span>
              <span>{goal.progress}% Complete</span>
            </div>
            
            <div className="flex justify-between mt-3 md:mt-4">
              <button className="text-[#e0b6f5] hover:text-purple-500 transition-colors text-sm">
                <i className="fas fa-edit mr-1"></i>Edit
              </button>
              <button className="text-green-500 hover:text-green-600 transition-colors text-sm">
                <i className="fas fa-chart-line mr-1"></i>Track
              </button>
            </div>
          </div>
        ))}
        
        {/* Add New Goal Card */}
        <div className="bg-gradient-to-br from-[#e0b6f5] to-purple-400 p-6 md:p-8 rounded-2xl shadow-2xl cursor-pointer transition-all duration-300 text-center">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <i className="fas fa-bullseye text-2xl md:text-3xl text-white"></i>
          </div>
          <h3 className="text-white font-semibold text-lg md:text-xl mb-2">Set New Goal</h3>
          <p className="text-white/90 text-sm md:text-base">What do you want to achieve next?</p>
        </div>
      </div>
    </div>
  );
};

// Enhanced Sidebar Component
const Sidebar = ({ activeSection, setActiveSection, isSidebarOpen, toggleSidebar, generatePDF, navigate, onGoToLanding }) => {
  const menuItems = [
    { id: 'overview', icon: 'fa-chart-pie', label: 'Overview' },
    { id: 'habits', icon: 'fa-list-check', label: 'Habits' },
    { id: 'goals', icon: 'fa-bullseye', label: 'Goals' },
    { id: 'chatboat', icon: 'fa-comments', label: 'Talk with Buddy' },
    { id: 'profile', icon: 'fa-user', label: 'Profile' },
    { id: 'soulfuel', icon: 'fa-heart', label: 'SoulFuel' },
    { id: 'analytics', icon: 'fa-chart-line', label: 'Analytics' },
  ];

  return (
    <div className={`bg-white shadow-2xl z-40 transition-all duration-300 ${
      isSidebarOpen ? 'w-64 md:w-80 fixed inset-0 md:relative' : 'w-0 md:w-20'
    } overflow-hidden flex flex-col`}>
      {/* Close overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
      
      <div className="p-4 md:p-6 flex items-center justify-between relative z-40 bg-white">
        <button 
          onClick={() => navigate('/')}
          className={`flex items-center transition-opacity duration-300 ${!isSidebarOpen && 'md:opacity-0'} cursor-pointer`}
        >
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-r from-[#e0b6f5] to-purple-500 flex items-center justify-center text-white font-bold shadow-lg">
            W
          </div>
          <h1 className="text-lg md:text-xl font-bold ml-3 text-gray-800">Wellness Tracker</h1>
        </button>
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors relative z-50"
        >
          <i className={`fas ${isSidebarOpen ? 'fa-times md:fa-chevron-left' : 'fa-bars md:fa-chevron-right'} transition-transform duration-300`}></i>
        </button>
      </div>
      
      <nav className="flex-1 p-4 md:p-6 relative z-40 bg-white">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => {
                  setActiveSection(item.id);
                  navigate(`/${item.id}`);
                  if (window.innerWidth < 768) {
                    toggleSidebar();
                  }
                }}
                className={`w-full flex items-center p-3 md:p-4 rounded-xl transition-all duration-300 group shadow-sm hover:shadow-md ${
                  activeSection === item.id 
                    ? 'bg-gradient-to-r from-[#e0b6f5] to-purple-500 text-white shadow-lg' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-[#e0b6f5]'
                }`}
              >
                <i className={`fas ${item.icon} text-base md:text-lg ${!isSidebarOpen && 'md:mx-auto'}`}></i>
                <span className={`ml-3 md:ml-4 font-medium ${!isSidebarOpen && 'md:hidden'} text-sm md:text-base`}>
                  {item.label}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 md:p-6 relative z-40 bg-white space-y-2">
        <button 
          onClick={onGoToLanding}
          className="w-full flex items-center p-3 md:p-4 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-[#e0b6f5] transition-all duration-300 group shadow-sm hover:shadow-md"
        >
          <i className={`fas fa-home text-base md:text-lg ${!isSidebarOpen && 'md:mx-auto'}`}></i>
          <span className={`ml-3 md:ml-4 font-medium ${!isSidebarOpen && 'md:hidden'} text-sm md:text-base`}>Home</span>
        </button>
        <button 
          onClick={generatePDF}
          className="w-full flex items-center p-3 md:p-4 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-[#e0b6f5] transition-all duration-300 group shadow-sm hover:shadow-md"
        >
          <i className={`fas fa-file-pdf text-base md:text-lg ${!isSidebarOpen && 'md:mx-auto'}`}></i>
          <span className={`ml-3 md:ml-4 font-medium ${!isSidebarOpen && 'md:hidden'} text-sm md:text-base`}>Download PDF</span>
        </button>
        <button className="w-full flex items-center p-3 md:p-4 rounded-xl text-gray-700 hover:bg-red-50 hover:text-red-500 transition-all duration-300 group shadow-sm hover:shadow-md">
          <i className={`fas fa-right-from-bracket text-base md:text-lg ${!isSidebarOpen && 'md:mx-auto'}`}></i>
          <span className={`ml-3 md:ml-4 font-medium ${!isSidebarOpen && 'md:hidden'} text-sm md:text-base`}>Logout</span>
        </button>
      </div>
    </div>
  );
};

// Main WellnessTracker Component
const WellnessTracker = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const [userData, setUserData] = useState({
    name: '',
    streak: 12,
    habits: [
      { id: 1, name: 'Morning Meditation', completed: true, frequency: 'Daily' },
      { id: 2, name: '30-min Exercise', completed: false, frequency: 'Daily' },
      { id: 3, name: 'Drink 2L Water', completed: true, frequency: 'Daily' },
      { id: 4, name: 'Read 20 pages', completed: false, frequency: 'Daily' },
      { id: 5, name: 'Evening Reflection', completed: false, frequency: 'Daily' },
      { id: 6, name: 'Healthy Breakfast', completed: true, frequency: 'Daily' }
    ],
    goals: [
      { id: 1, name: 'Run 5K', progress: 70, target: '2 weeks' },
      { id: 2, name: 'Meditate daily', progress: 85, target: '30 days' },
      { id: 3, name: 'Sleep 8 hours', progress: 60, target: 'Ongoing' },
      { id: 4, name: 'Read 5 books', progress: 40, target: '3 months' }
    ],
    wellnessStats: {
      mindfulness: 75,
      exercise: 60,
      nutrition: 80,
      sleep: 70
    }
  });

  // Update active section based on route
  useEffect(() => {
    const path = location.pathname.substring(1) || 'overview';
    setActiveSection(path);
  }, [location]);

  // Auto-close sidebar on desktop, keep closed on mobile by default
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const generatePDF = () => {
    alert('PDF generation would be implemented here!');
  };

  const toggleHabit = (id) => {
    setUserData(prev => ({
      ...prev,
      habits: prev.habits.map(habit => 
        habit.id === id ? { ...habit, completed: !habit.completed } : habit
      )
    }));
  };

  const handleGoToLanding = () => {
    // Navigate to your landing page route
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      <Sidebar 
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        generatePDF={generatePDF}
        navigate={navigate}
        onGoToLanding={handleGoToLanding}
      />
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto relative">
        <MobileHeader 
          toggleSidebar={toggleSidebar} 
          navigate={navigate}
          userData={userData}
          onGoToLanding={handleGoToLanding}
        />
        <div className="p-4 md:p-6 lg:p-8">
          <Routes>
            <Route path="/" element={<Overview userData={userData} toggleHabit={toggleHabit} />} />
            <Route path="/" element={<WellnessTracker/>} />
            <Route path="/habits" element={<HabitsPage userData={userData} toggleHabit={toggleHabit} />} />
            <Route path="/goals" element={<GoalsPage userData={userData} />} />
            <Route path="/chatboat" element={<AiChat />} />
            <Route path="*" element={<Overview userData={userData} toggleHabit={toggleHabit} />} />
          </Routes>
        </div>
        <MobileBottomNav 
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          navigate={navigate}
        />
      </div>
    </div>
  );
};

export default WellnessTracker;