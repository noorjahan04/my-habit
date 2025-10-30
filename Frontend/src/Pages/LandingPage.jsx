import React from "react";
import { motion } from "framer-motion";
import { FaHeartbeat, FaLeaf, FaRunning, FaSmileBeam, FaUserCircle, FaChartLine, FaUsers } from "react-icons/fa";

export default function LandingPage() {
  const accent = "#e0b6f5";
  








  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* Header */}
     

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <motion.h1 initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:0.7}} className="text-5xl font-extrabold leading-tight text-gray-900">
            Build healthy habits for a balanced life
          </motion.h1>
          <p className="mt-6 text-gray-700 max-w-lg">
            Track your wellness journey, set daily goals, and stay motivated with real-time progress visualization, community support, and guided wellness plans.
          </p>
          <div className="mt-8 flex gap-3">
            <button className={`px-6 py-3 rounded-full font-semibold text-white shadow-lg`} style={{ backgroundColor: accent }}>Start Tracking</button>
            <button className="px-6 py-3 rounded-full border border-gray-300 hover:bg-gray-100">Learn More</button>
          </div>
        </div>

        <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} transition={{delay:0.3}} className="relative">
          <div className="relative mx-auto max-w-md p-6 rounded-2xl bg-white border border-gray-200 shadow-2xl">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2"><FaHeartbeat style={{ color: accent }} /> Wellness Dashboard</h3>
            <p className="text-sm text-gray-600 mt-2">Visualize your daily habits, goals, and progress in one place.</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-gray-100 flex items-center gap-2"><FaRunning style={{ color: accent }} /> Exercise</div>
              <div className="p-3 rounded-lg bg-gray-100 flex items-center gap-2"><FaSmileBeam style={{ color: accent }} /> Mindfulness</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 text-white" style={{ backgroundColor: accent }}>
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold">Your Wellness, Simplified</h2>
          <p className="mt-3 opacity-90 max-w-2xl">Track, visualize, and celebrate your wellness habits with beautiful insights and personalized recommendations.</p>
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            {[
              { icon: <FaRunning />, title: 'Activity Tracking', desc: 'Monitor daily movement and set fitness targets.' },
              { icon: <FaLeaf />, title: 'Healthy Nutrition', desc: 'Track your meals and stay on top of nutrition goals.' },
              { icon: <FaSmileBeam />, title: 'Mindfulness & Sleep', desc: 'Get guided meditations and sleep tracking tools.' },
            ].map((f, i) => (
              <motion.div key={i} whileHover={{y:-6}} className="p-6 rounded-2xl bg-white/20 border border-white/30">
                <div className="text-3xl mb-2">{f.icon}</div>
                <h3 className="font-semibold text-lg">{f.title}</h3>
                <p className="text-sm mt-2 opacity-90">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Progress Section */}
      <section id="progress" className="py-16 bg-gray-50 text-gray-900">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4 flex justify-center items-center gap-2"><FaChartLine style={{ color: accent }} /> Track Your Progress</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">Stay on top of your goals with visualized analytics that make improvement tangible and fun.</p>
          <motion.div whileHover={{ scale: 1.05 }} className="p-8 bg-white shadow-lg rounded-2xl border border-gray-200 inline-block">
            <p className="text-6xl font-bold" style={{ color: accent }}>78%</p>
            <p className="mt-2 text-gray-600">Average Daily Goal Completion</p>
          </motion.div>
        </div>
      </section>

      {/* Community Section */}
      <section id="community" className="py-16 bg-white text-gray-900">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold mb-4 flex justify-center items-center gap-2"><FaUsers style={{ color: accent }} /> Join Our Wellness Community</h3>
          <p className="text-gray-600 max-w-3xl mx-auto mb-6">Connect with others on a similar journey, share your wins, and get inspired by people who care about holistic health.</p>
          <button className={`px-6 py-3 rounded-full text-white font-semibold`} style={{ backgroundColor: accent }}>Join Now</button>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-white text-gray-900">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h3 className="text-2xl font-bold mb-4">Contact Us</h3>
            <p className="text-gray-600 mb-6">We’re here to help you stay on track with your wellness goals. Reach out anytime!</p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-center gap-2"><FaHeartbeat style={{ color: accent }} /> support@wellnesshabit.com</li>
              <li className="flex items-center gap-2"><FaHeartbeat style={{ color: accent }} /> +1 (234) 567-890</li>
            </ul>
          </div>

          <form className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow">
            <input type="text" placeholder="Your Name" className="w-full mb-4 p-3 border rounded" />
            <input type="email" placeholder="Your Email" className="w-full mb-4 p-3 border rounded" />
            <textarea placeholder="Your Message" className="w-full mb-4 p-3 border rounded h-32"></textarea>
            <button type="submit" className="w-full p-3 rounded-full text-white font-semibold" style={{ backgroundColor: accent }}>Send Message</button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-200 text-center text-sm text-gray-600 bg-white/90 backdrop-blur-md">
  {/* Brand & Message */}
  <p className="font-semibold text-gray-800">
    © {new Date().getFullYear()} <span className="text-green-600">Wellness Habit Tracker</span> — Nurture your mind and body 🌿
  </p>
  <p className="mt-1">Made with ❤ for a healthier lifestyle</p>

  {/* Quick Links */}
  <div className="mt-4 flex justify-center gap-4">
    <a href="#features" className="hover:text-green-500 transition-colors">Features</a>
    <a href="#goals" className="hover:text-green-500 transition-colors">Goals</a>
    <a href="#community" className="hover:text-green-500 transition-colors">Community</a>
    <a href="#contact" className="hover:text-green-500 transition-colors">Contact</a>
  </div>

 
  

  {/* Privacy / Terms */}
  <div className="mt-4 flex justify-center gap-4 text-xs text-gray-500">
    <a href="/privacy" className="hover:text-gray-800 transition-colors">Privacy Policy</a>
    <a href="/terms" className="hover:text-gray-800 transition-colors">Terms of Service</a>
  </div>
</footer>
    </div>
  );
}
