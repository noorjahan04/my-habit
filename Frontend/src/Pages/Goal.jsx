import React, { useEffect, useState } from "react";
import { 
  FaPlus, 
  FaTrash, 
  FaCheck, 
  FaTimes,
  FaCalendarAlt,
  FaLeaf,
  FaHeart,
  FaUser,
  FaDollarSign,
  FaHome
} from "react-icons/fa";

// Fallback icons
const TargetIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 0a10 10 0 1010 10A10 10 0 0010 0zm0 18a8 8 0 118-8 8 8 0 01-8 8zm0-4a4 4 0 10-4-4 4 4 0 004 4z"/>
  </svg>
);

const AppleIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z"/>
  </svg>
);

function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    targetDate: "",
  });

  // Fetch all goals
  const fetchGoals = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://my-habit-4.onrender.com/Goal/getgoal", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      
      if (!res.ok) throw new Error("Failed to fetch goals");
      
      const data = await res.json();
      setGoals(data || []);
    } catch (err) {
      console.error("Error fetching goals:", err);
      setGoals([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  // Add new goal
  const addGoal = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://my-habit-4.onrender.com/Goal/goalcreate", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      
      if (data.success) {
        const newGoal = data.goal;
        setGoals([newGoal, ...goals]);
        setFormData({ title: "", description: "", targetDate: "" });
        setShowForm(false);
      } else {
        console.error("Error creating goal:", data.message);
        alert(data.message || "Failed to create goal");
      }
    } catch (err) {
      console.error("Error creating goal:", err);
      alert("Failed to create goal. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Delete goal
  const deleteGoal = async (id) => {
    if (!window.confirm("Are you sure you want to delete this goal?")) return;
    
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://my-habit-4.onrender.com/Goal/${id}`, { 
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await res.json();
      
      if (data.success) {
        setGoals(goals.filter((g) => g._id !== id));
      } else {
        console.error("Error deleting goal:", data.message);
        alert(data.message || "Failed to delete goal");
      }
    } catch (err) {
      console.error("Error deleting goal:", err);
      alert("Failed to delete goal. Please try again.");
    }
  };

  // Mark goal as completed
  const markCompleted = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://my-habit-4.onrender.com/Goal/${id}/complete`, {
        method: "PATCH",
        headers: { 
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await res.json();
      
      if (data.success) {
        const updatedGoal = data.goal;
        setGoals(goals.map((g) => (g._id === id ? updatedGoal : g)));
      } else {
        console.error("Error marking completed:", data.message);
        alert(data.message || "Failed to mark goal as completed");
      }
    } catch (err) {
      console.error("Error marking completed:", err);
      alert("Failed to mark goal as completed. Please try again.");
    }
  };

  // Update goal progress
  const updateProgress = async (id, progress) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://my-habit-4.onrender.com/Goal/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ progress }),
      });
      const data = await res.json();
      
      if (data.success) {
        const updatedGoal = data.goal;
        setGoals(goals.map((g) => (g._id === id ? updatedGoal : g)));
      } else {
        console.error("Error updating progress:", data.message);
      }
    } catch (err) {
      console.error("Error updating progress:", err);
    }
  };

  // Habit categories
  const [expanded, setExpanded] = useState(null);
  const toggleSection = (id) => setExpanded(expanded === id ? null : id);

  const sections = [
    {
      id: "organization",
      icon: <FaHome className="text-[#e0b6f5]" />,
      title: "Organization",
      habits: [
        { title: "Make Your Bed", desc: "Start your day tidy by making your bed." },
        { title: "Keep Your Home Tidy", desc: "Clean and declutter regularly." },
        { title: "Organize an Area Each Day", desc: "Tackle one small area daily." },
        { title: "Limit Social Media", desc: "Set time limits to stay productive." },
      ],
    },
    {
      id: "relationships",
      icon: <FaHeart className="text-[#e0b6f5]" />,
      title: "Relationships",
      habits: [
        { title: "Connect with People", desc: "Reach out and nurture friendships." },
        { title: "Spend Time with Each Child", desc: "Create one-on-one moments." },
        { title: "Spend Time with Your Partner", desc: "Schedule regular quality time." },
        { title: "Communicate with Your Partner", desc: "Have open, honest talks." },
        { title: "Compliment Someone", desc: "Brighten someone's day genuinely." },
      ],
    },
    {
      id: "selfcare",
      icon: <FaUser className="text-[#e0b6f5]" />,
      title: "Self-Care",
      habits: [
        { title: "Meditate", desc: "Take time daily to find calm and focus." },
        { title: "Deep Breathing", desc: "Use breathing to relax the body and mind." },
        { title: "Yoga", desc: "Improve strength and clarity through yoga." },
        { title: "Skincare", desc: "Follow a daily skincare routine." },
        { title: "Relax", desc: "Unwind with calming activities or a bubble bath." },
      ],
    },
    {
      id: "personal",
      icon: <FaLeaf className="text-[#e0b6f5]" />,
      title: "Personal Development",
      habits: [
        { title: "Track Mood", desc: "Monitor your emotions daily." },
        { title: "Positive Affirmations", desc: "Build confidence through affirmations." },
        { title: "Gratitude Log", desc: "Write 3 things you're grateful for." },
        { title: "Journal Every Day", desc: "Reflect on your thoughts and growth." },
        { title: "Start a New Hobby", desc: "Learn something new and fun." },
      ],
    },
    {
      id: "financial",
      icon: <FaDollarSign className="text-[#e0b6f5]" />,
      title: "Financial",
      habits: [
        { title: "Limit Spending", desc: "Avoid unnecessary purchases." },
        { title: "Increase Savings", desc: "Set aside a portion of income monthly." },
        { title: "Budgeting", desc: "Track income and expenses consistently." },
        { title: "Debt Management", desc: "Create a plan to pay off debts." },
        { title: "Emergency Fund", desc: "Build 3–6 months of savings." },
      ],
    },
    {
      id: "health",
      icon: <AppleIcon />,
      title: "Health",
      habits: [
        { title: "Increase Water Intake", desc: "Drink 8 glasses of water daily." },
        { title: "Sleep More", desc: "Get 7–9 hours of sleep per night." },
        { title: "Exercise 30 Minutes", desc: "Stay active and move daily." },
        { title: "Eat 5 a Day", desc: "Consume 5 servings of fruits & veggies." },
        { title: "Eat Clean", desc: "Choose whole, natural foods." },
      ],
    },
  ];

  return (
    <div className="min-h-screen p-4 md:p-8 text-gray-800 bg-gradient-to-br from-[#f8f4ff] to-[#f0e5ff]">
      {/* Overlay Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowForm(false)}
          ></div>
          
          {/* Form */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto transform transition-all">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <TargetIcon />
                  Create New Goal
                </h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FaTimes className="text-gray-500" />
                </button>
              </div>

              <form onSubmit={addGoal} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Goal Title *
                  </label>
                  <input
                    type="text"
                    placeholder="What do you want to achieve?"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e0b6f5] focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    placeholder="Add more details about your goal..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows="3"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e0b6f5] focus:border-transparent resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Date *
                  </label>
                  <div className="relative">
                    <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="date"
                      value={formData.targetDate}
                      onChange={(e) =>
                        setFormData({ ...formData, targetDate: e.target.value })
                      }
                      className="w-full border border-gray-300 p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e0b6f5] focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-3 bg-[#e0b6f5] hover:bg-[#d1a7f0] text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <FaPlus />
                    )}
                    {loading ? "Creating..." : "Create Goal"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-8 md:mb-12">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">
          If You Can Dream It, You Can Make It <span className="text-[#e0b6f5]">✨</span>
        </h1>
        <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
          Set your goals, build your habits, and make your dreams real <span className="text-[#e0b6f5]">💜</span>
        </p>
      </div>

      {/* GOALS SECTION */}
      <div className="max-w-7xl mx-auto mb-12 md:mb-16">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
            <TargetIcon />
            My Goals
            {goals.length > 0 && (
              <span className="bg-[#e0b6f5] text-white text-sm px-3 py-1 rounded-full">
                {goals.length} {goals.length === 1 ? 'goal' : 'goals'}
              </span>
            )}
          </h2>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-[#e0b6f5] hover:bg-[#d1a7f0] transition-all text-white rounded-xl shadow-lg hover:shadow-xl font-semibold"
          >
            <FaPlus />
            New Goal
          </button>
        </div>

        {/* Goals Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e0b6f5]"></div>
          </div>
        ) : goals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map((goal) => (
              <div
                key={goal._id}
                className={`relative p-6 rounded-2xl shadow-lg border-l-4 transition-all hover:shadow-xl ${
                  goal.completed 
                    ? 'bg-green-50 border-green-400' 
                    : 'bg-white border-[#e0b6f5]'
                }`}
              >
                {/* Completion Badge */}
                {goal.completed && (
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <FaCheck size={12} />
                    Completed
                  </div>
                )}

                <h3 className="text-xl font-bold text-gray-800 mb-3 pr-16">
                  {goal.title}
                </h3>
                
                {goal.description && (
                  <p className="text-gray-600 mb-4 line-clamp-3">{goal.description}</p>
                )}

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <FaCalendarAlt className="text-[#e0b6f5]" />
                    <span>Due: {new Date(goal.targetDate).toLocaleDateString()}</span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium text-[#e0b6f5]">{goal.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-[#e0b6f5] h-2 rounded-full transition-all duration-500"
                        style={{ width: `${goal.progress}%` }}
                      ></div>
                    </div>
                    {!goal.completed && (
                      <div className="flex gap-1">
                        {[0, 25, 50, 75, 100].map((value) => (
                          <button
                            key={value}
                            onClick={() => updateProgress(goal._id, value)}
                            className={`text-xs px-2 py-1 rounded ${
                              goal.progress === value 
                                ? 'bg-[#e0b6f5] text-white' 
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {value}%
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  {!goal.completed && (
                    <button
                      onClick={() => markCompleted(goal._id)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm font-medium"
                    >
                      <FaCheck />
                      Complete
                    </button>
                  )}
                  <button
                    onClick={() => deleteGoal(goal._id)}
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm font-medium"
                  >
                    <FaTrash />
                  </button>
                </div>

                {/* Created Date */}
                <div className="text-xs text-gray-400 mt-3">
                  Created: {new Date(goal.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
            <div className="mx-auto text-6xl text-gray-300 mb-4">
              <TargetIcon />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No goals yet</h3>
            <p className="text-gray-500 mb-6">Create your first goal to get started!</p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#e0b6f5] hover:bg-[#d1a7f0] text-white rounded-lg transition-colors font-semibold"
            >
              <FaPlus />
              Create Your First Goal
            </button>
          </div>
        )}
      </div>

      {/* HABIT CATEGORIES */}
      <div className="max-w-7xl mx-auto space-y-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-8 flex items-center justify-center gap-3">
          <FaLeaf className="text-[#e0b6f5]" />
          Habit Ideas to Get You Started
          <span className="text-[#e0b6f5]">🌟</span>
        </h2>
        
        {sections.map((section) => (
          <div
            key={section.id}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden"
          >
            <button
              onClick={() => toggleSection(section.id)}
              className="flex justify-between items-center w-full text-left p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#f8f4ff] rounded-xl">
                  {section.icon}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {section.title}
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    {section.habits.length} habit ideas
                  </p>
                </div>
              </div>
              <div className={`transform transition-transform ${expanded === section.id ? 'rotate-180' : ''}`}>
                <FaPlus className="text-[#e0b6f5]" />
              </div>
            </button>

            {expanded === section.id && (
              <div className="p-6 border-t">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {section.habits.map((habit, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gradient-to-br from-[#f8f4ff] to-[#f0e5ff] rounded-xl border border-[#e0b6f5] hover:shadow-md transition-all"
                    >
                      <h4 className="font-semibold text-gray-800 mb-2">
                        {habit.title}
                      </h4>
                      <p className="text-gray-600 text-sm">{habit.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="text-center mt-12 md:mt-16 text-gray-600 text-sm">
        © 2025 Dream Goals Planner — Designed with <span className="text-[#e0b6f5]">💜</span> to inspire growth & balance.
      </footer>
    </div>
  );
}

export default GoalsPage;