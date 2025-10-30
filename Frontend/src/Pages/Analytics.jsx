import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area, LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { FaChartLine, FaFire, FaCheckCircle, FaSync, FaCalendarAlt, FaFlag, FaStar, FaTasks, FaRunning, FaBook, FaWater, FaBed, FaAppleAlt } from "react-icons/fa";

const AnalyticsDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const COLORS = ['#e0b6f5', '#c895e4', '#a874d3', '#8853c2', '#6732b1'];

  // Hardcoded demo data
  const hardcodedData = {
    overview: { 
      currentStreak: 12, 
      totalHabits: 8, 
      completedHabits: 6, 
      totalGoals: 5, 
      completedGoals: 3, 
      habitCompletionRate: 75, 
      goalCompletionRate: 60, 
      productivityScore: 68 
    },
    habitDistribution: [
      { name: 'Completed', value: 6 },
      { name: 'Pending', value: 2 }
    ],
    goalsData: [
      {
        _id: '1',
        name: 'Build a website',
        description: 'Build a website using MERN stack',
        progress: 100,
        target: 100,
        completed: true,
        targetDate: '2025-10-22T00:00:00.000Z',
        completedAt: '2025-10-25T23:49:34.402Z',
        createdAt: '2025-10-25T23:48:06.789Z',
        completionPercentage: 100
      },
      {
        _id: '2',
        name: 'Learn React Native',
        description: 'Master mobile app development',
        progress: 75,
        target: 100,
        completed: false,
        targetDate: '2025-12-15T00:00:00.000Z',
        completedAt: null,
        createdAt: '2025-10-20T10:30:00.000Z',
        completionPercentage: 75
      },
      {
        _id: '3',
        name: 'Morning Meditation',
        description: 'Practice meditation every morning',
        progress: 100,
        target: 100,
        completed: true,
        targetDate: '2025-10-30T00:00:00.000Z',
        completedAt: '2025-10-26T08:00:00.000Z',
        createdAt: '2025-10-15T09:00:00.000Z',
        completionPercentage: 100
      }
    ],
    // New data for habits tab
    habitsData: [
      { name: 'Morning Meditation', completed: true, streak: 15, frequency: 'Daily', icon: <FaBook />, category: 'Mindfulness' },
      { name: 'Exercise', completed: true, streak: 8, frequency: 'Daily', icon: <FaRunning />, category: 'Fitness' },
      { name: 'Read Book', completed: false, streak: 22, frequency: 'Daily', icon: <FaBook />, category: 'Learning' },
      { name: 'Drink Water', completed: true, streak: 5, frequency: 'Daily', icon: <FaWater />, category: 'Health' },
      { name: 'Sleep 8 Hours', completed: false, streak: 3, frequency: 'Daily', icon: <FaBed />, category: 'Health' },
      { name: 'Healthy Eating', completed: true, streak: 12, frequency: 'Daily', icon: <FaAppleAlt />, category: 'Nutrition' }
    ],
    habitCategories: [
      { category: 'Mindfulness', count: 2, completed: 1 },
      { category: 'Fitness', count: 3, completed: 2 },
      { category: 'Learning', count: 2, completed: 1 },
      { category: 'Health', count: 4, completed: 3 },
      { category: 'Nutrition', count: 1, completed: 1 }
    ],
    habitPerformance: [
      { habit: 'Meditation', monday: 85, tuesday: 90, wednesday: 78, thursday: 92, friday: 88, saturday: 75, sunday: 80 },
      { habit: 'Exercise', monday: 75, tuesday: 80, wednesday: 85, thursday: 70, friday: 90, saturday: 65, sunday: 95 },
      { habit: 'Reading', monday: 60, tuesday: 65, wednesday: 70, thursday: 55, friday: 80, saturday: 90, sunday: 85 }
    ],
    recentActivity: [
      { habitName: 'Morning Meditation', completed: true, timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) },
      { habitName: 'Exercise', completed: true, timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000) },
      { habitName: 'Read Book', completed: false, timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000) },
      { habitName: 'Drink Water', completed: true, timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000) },
      { habitName: 'Journaling', completed: true, timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000) }
    ],
    weeklyProgress: [
      { day: 'Mon', completion: 85, habits: 7 },
      { day: 'Tue', completion: 72, habits: 6 },
      { day: 'Wed', completion: 90, habits: 8 },
      { day: 'Thu', completion: 65, habits: 5 },
      { day: 'Fri', completion: 88, habits: 7 },
      { day: 'Sat', completion: 78, habits: 6 },
      { day: 'Sun', completion: 95, habits: 8 }
    ],
    monthlyTrends: [
      { month: 'Jan', habits: 45, goals: 8, productivity: 65 },
      { month: 'Feb', habits: 52, goals: 10, productivity: 72 },
      { month: 'Mar', habits: 48, goals: 12, productivity: 68 },
      { month: 'Apr', habits: 58, goals: 15, productivity: 81 },
      { month: 'May', habits: 55, goals: 18, productivity: 76 },
      { month: 'Jun', habits: 62, goals: 20, productivity: 85 }
    ],
    // New data for trends tab
    productivityTrends: [
      { week: 'Week 1', productivity: 65, focus: 70, energy: 60 },
      { week: 'Week 2', productivity: 72, focus: 68, energy: 65 },
      { week: 'Week 3', productivity: 68, focus: 75, energy: 70 },
      { week: 'Week 4', productivity: 81, focus: 78, energy: 75 },
      { week: 'Week 5', productivity: 76, focus: 72, energy: 80 },
      { week: 'Week 6', productivity: 85, focus: 82, energy: 78 }
    ],
    categoryPerformance: [
      { subject: 'Fitness', score: 85, fullMark: 100 },
      { subject: 'Mindfulness', score: 78, fullMark: 100 },
      { subject: 'Learning', score: 92, fullMark: 100 },
      { subject: 'Health', score: 88, fullMark: 100 },
      { subject: 'Nutrition', score: 75, fullMark: 100 }
    ]
  };

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAnalyticsData(hardcodedData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setAnalyticsData(hardcodedData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const StatCard = ({ title, value, subtitle, icon, color = '#e0b6f5', delay = 0 }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.02, y: -2 }}
      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium mb-2">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-2">{subtitle}</p>}
        </div>
        <motion.div
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 0.5 }}
          className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl"
          style={{ backgroundColor: color }}
        >
          {icon}
        </motion.div>
      </div>
    </motion.div>
  );

  const GoalProgressCard = ({ goal, index }) => {
    const completionDate = goal.completedAt ? new Date(goal.completedAt) : null;
    const targetDate = goal.targetDate ? new Date(goal.targetDate) : null;
    const isOverdue = targetDate && targetDate < new Date() && !goal.completed;

    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 }}
        className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all"
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h4 className="font-bold text-gray-900 text-lg mb-2">{goal.name}</h4>
            {goal.description && (
              <p className="text-gray-600 text-sm mb-3">{goal.description}</p>
            )}
          </div>
          <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
            goal.completed 
              ? 'bg-green-100 text-green-800' 
              : isOverdue
              ? 'bg-red-100 text-red-800'
              : 'bg-blue-100 text-blue-800'
          }`}>
            {goal.completed ? 'Completed' : isOverdue ? 'Overdue' : 'In Progress'}
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${goal.completionPercentage}%` }}
            transition={{ duration: 1, delay: index * 0.2 }}
            className={`h-3 rounded-full ${
              goal.completed ? 'bg-green-500' : 
              isOverdue ? 'bg-red-500' : 'bg-[#e0b6f5]'
            }`}
          />
        </div>
        
        <div className="flex justify-between items-center text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <span className="font-semibold">{goal.completionPercentage}% Complete</span>
            {goal.completed ? (
              <span className="text-green-600 flex items-center gap-1">
                <FaCheckCircle className="text-green-500" />
                Completed on {completionDate?.toLocaleDateString()}
              </span>
            ) : targetDate ? (
              <span className={isOverdue ? 'text-red-600 flex items-center gap-1' : 'text-gray-500 flex items-center gap-1'}>
                <FaCalendarAlt />
                Due: {targetDate.toLocaleDateString()}
              </span>
            ) : null}
          </div>
        </div>
      </motion.div>
    );
  };

  const HabitCard = ({ habit, index }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#e0b6f5] rounded-lg flex items-center justify-center text-white">
            {habit.icon}
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-lg">{habit.name}</h4>
            <p className="text-gray-600 text-sm">{habit.category}</p>
          </div>
        </div>
        <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
          habit.completed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {habit.completed ? 'Completed' : 'Missed'}
        </span>
      </div>
      
      <div className="flex justify-between items-center text-sm text-gray-600">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <FaFire className="text-orange-500" />
            {habit.streak} days
          </span>
          <span className="text-gray-500">{habit.frequency}</span>
        </div>
        <div className={`w-3 h-3 rounded-full ${habit.completed ? 'bg-green-500' : 'bg-red-500'}`} />
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8f4ff] to-[#f0e5ff] flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-[#e0b6f5] border-t-transparent rounded-full mx-auto mb-4"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-[#e0b6f5] font-semibold text-lg"
          >
            Loading Your Analytics...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 text-gray-800 bg-gradient-to-br from-[#f8f4ff] to-[#f0e5ff]">
      {/* Header */}
      <div className="text-center mb-8 md:mb-12">
        <motion.h1 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-3xl md:text-5xl font-bold text-gray-800 mb-4"
        >
          Track Your Progress <span className="text-[#e0b6f5]">✨</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto"
        >
          Visualize your habits, goals, and achievements in one beautiful dashboard <span className="text-[#e0b6f5]">💜</span>
        </motion.p>
      </div>

      {/* Tab Navigation */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-2xl p-2 shadow-lg mb-8 max-w-4xl mx-auto"
      >
        <div className="flex space-x-2">
          {[
            { id: 'overview', label: 'Overview', icon: <FaChartLine /> },
            { id: 'goals', label: 'Goals', icon: <FaFlag /> },
            { id: 'habits', label: 'Habits', icon: <FaTasks /> },
            { id: 'trends', label: 'Trends', icon: <FaStar /> }
          ].map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-[#e0b6f5] text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.icon}
              {tab.label}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Refresh Button */}
      <div className="flex justify-center mb-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={fetchAnalyticsData}
          className="flex items-center gap-3 px-6 py-3 bg-[#e0b6f5] hover:bg-[#d1a7f0] text-white rounded-xl shadow-lg hover:shadow-xl transition-all font-semibold"
        >
          <FaSync />
          Refresh Analytics
        </motion.button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && analyticsData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto space-y-8"
        >
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Current Streak"
              value={analyticsData.overview.currentStreak}
              subtitle="days in a row"
              icon={<FaFire />}
              color="#ff6b6b"
              delay={0.1}
            />
            <StatCard
              title="Habit Completion"
              value={`${analyticsData.overview.habitCompletionRate}%`}
              subtitle={`${analyticsData.overview.completedHabits}/${analyticsData.overview.totalHabits} habits`}
              icon={<FaTasks />}
              delay={0.2}
            />
            <StatCard
              title="Goals Completed"
              value={analyticsData.overview.completedGoals}
              subtitle={`of ${analyticsData.overview.totalGoals} total`}
              icon={<FaFlag />}
              color="#4ecdc4"
              delay={0.3}
            />
            <StatCard
              title="Productivity Score"
              value={`${analyticsData.overview.productivityScore}%`}
              subtitle="overall performance"
              icon={<FaChartLine />}
              color="#45b7d1"
              delay={0.4}
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Weekly Progress */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaChartLine className="text-[#e0b6f5]" />
                Weekly Progress Trend
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analyticsData.weeklyProgress}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="completion" 
                    stroke="#e0b6f5" 
                    fill="#e0b6f5" 
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Habit Distribution */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaTasks className="text-[#e0b6f5]" />
                Today's Habit Distribution
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analyticsData.habitDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {analyticsData.habitDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} habits`, 'Count']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center space-x-6 mt-4">
                {analyticsData.habitDistribution.map((item, index) => (
                  <div key={item.name} className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Monthly Trends */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FaStar className="text-[#e0b6f5]" />
              Monthly Progress Trends
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData.monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="productivity" 
                  stroke="#e0b6f5" 
                  strokeWidth={3}
                  dot={{ fill: '#e0b6f5', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </motion.div>
      )}

      {/* Goals Tab */}
      {activeTab === 'goals' && analyticsData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto space-y-8"
        >
          {/* Goals Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              title="Total Goals"
              value={analyticsData.overview.totalGoals}
              subtitle="active goals"
              icon={<FaFlag />}
            />
            <StatCard
              title="Completed"
              value={analyticsData.overview.completedGoals}
              subtitle="goals achieved"
              icon={<FaCheckCircle />}
              color="#4ecdc4"
            />
            <StatCard
              title="Success Rate"
              value={`${analyticsData.overview.goalCompletionRate}%`}
              subtitle="completion rate"
              icon={<FaStar />}
              color="#45b7d1"
            />
          </div>

          {/* Goals Progress */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl p-8 shadow-lg"
          >
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <FaFlag className="text-[#e0b6f5]" />
                  Your Goals Progress
                </h3>
                <p className="text-gray-600 mt-2">
                  {analyticsData.overview.completedGoals} of {analyticsData.overview.totalGoals} goals completed
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-[#e0b6f5]">
                  {analyticsData.overview.goalCompletionRate}%
                </div>
                <div className="text-sm text-gray-500">Overall Completion</div>
              </div>
            </div>

            {analyticsData.goalsData.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {analyticsData.goalsData.map((goal, index) => (
                  <GoalProgressCard key={goal._id} goal={goal} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">
                  <FaFlag className="text-gray-300 mx-auto" size={64} />
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-3">No Goals Set Yet</h4>
                <p className="text-gray-600 text-lg max-w-md mx-auto">
                  Start setting goals to track your progress and achieve amazing things!
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}

      {/* Habits Tab */}
      {activeTab === 'habits' && analyticsData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto space-y-8"
        >
          {/* Habits Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              title="Total Habits"
              value={analyticsData.overview.totalHabits}
              subtitle="active habits"
              icon={<FaTasks />}
            />
            <StatCard
              title="Completed Today"
              value={analyticsData.overview.completedHabits}
              subtitle="habits done"
              icon={<FaCheckCircle />}
              color="#4ecdc4"
            />
            <StatCard
              title="Completion Rate"
              value={`${analyticsData.overview.habitCompletionRate}%`}
              subtitle="daily average"
              icon={<FaStar />}
              color="#45b7d1"
            />
          </div>

          {/* Habits Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl p-8 shadow-lg"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <FaTasks className="text-[#e0b6f5]" />
              Your Daily Habits
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {analyticsData.habitsData.map((habit, index) => (
                <HabitCard key={habit.name} habit={habit} index={index} />
              ))}
            </div>
          </motion.div>

          {/* Habit Performance Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FaChartLine className="text-[#e0b6f5]" />
              Weekly Habit Performance
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.habitPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="habit" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="monday" fill="#e0b6f5" name="Monday" />
                <Bar dataKey="tuesday" fill="#c895e4" name="Tuesday" />
                <Bar dataKey="wednesday" fill="#a874d3" name="Wednesday" />
                <Bar dataKey="thursday" fill="#8853c2" name="Thursday" />
                <Bar dataKey="friday" fill="#6732b1" name="Friday" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </motion.div>
      )}

      {/* Trends Tab */}
      {activeTab === 'trends' && analyticsData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto space-y-8"
        >
          {/* Productivity Trends */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FaChartLine className="text-[#e0b6f5]" />
              Weekly Productivity Trends
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData.productivityTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="productivity" stroke="#e0b6f5" strokeWidth={3} name="Productivity" />
                <Line type="monotone" dataKey="focus" stroke="#4ecdc4" strokeWidth={2} name="Focus" />
                <Line type="monotone" dataKey="energy" stroke="#ff6b6b" strokeWidth={2} name="Energy" />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Category Performance Radar */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaStar className="text-[#e0b6f5]" />
                Category Performance
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={analyticsData.categoryPerformance}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis />
                  <Radar name="Performance" dataKey="score" stroke="#e0b6f5" fill="#e0b6f5" fillOpacity={0.6} />
                </RadarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Habit Categories Distribution */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaTasks className="text-[#e0b6f5]" />
                Habit Categories
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData.habitCategories}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#e0b6f5" name="Total Habits" />
                  <Bar dataKey="completed" fill="#4ecdc4" name="Completed" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Footer */}
      <footer className="text-center mt-12 md:mt-16 text-gray-600 text-sm">
        © 2025 Progress Tracker — Designed with <span className="text-[#e0b6f5]">💜</span> to help you grow & achieve.
      </footer>
    </div>
  );
};

export default AnalyticsDashboard;