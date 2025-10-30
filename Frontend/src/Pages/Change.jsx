import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email'); 
 
  
  const [showPassword, setShowPassword] = useState({
    newPassword: false,
    confirmPassword: false
  });
  const [form, setForm] = useState({ 
    newPassword: "", 
    confirmPassword: "" 
  });
  const [loading, setLoading] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    if (form.newPassword.length < 6) {
      toast.error("Password should be at least 6 characters");
      setLoading(false);
      return;
    }
  
    if (form.newPassword !== form.confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }
  
    if (!token || !email) {
      toast.error("Invalid reset link");
      setLoading(false);
      return;
    }
  
    // Enhanced debugging
    console.log("=== DEBUG INFO ===");
    console.log("Token from URL:", token);
    console.log("Email from URL:", email);
    console.log("Password:", form.newPassword);
    console.log("Token length:", token?.length);
    console.log("Email valid:", email?.includes('@'));
    
    const requestBody = { 
      token: token,
      email: email,
      password: form.newPassword 
    };
    
    console.log("Request body:", requestBody);
    console.log("JSON stringified:", JSON.stringify(requestBody));
  
    try {
      const response = await fetch("https://my-habit-4.onrender.com/users/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
  
      console.log("Response status:", response.status);
      
      const data = await response.json();
      console.log("Response data:", data);
  
      if (!response.ok) {
        toast.error(data.message || "Failed to reset password");
      } else {
        toast.success("Password reset successfully!");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err) {
      console.error("Network error:", err);
      toast.error("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Show error if token or email is missing
  if (!token || !email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-[#f7f0ff]">
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-md">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Invalid Reset Link</h2>
          <p className="text-gray-600 mb-6">This password reset link is invalid or has expired.</p>
          <a href="/forgot-password" className="text-[#6e3aa8] font-medium hover:underline">
            Request a new reset link
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-[#f7f0ff]">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="relative w-full max-w-5xl mx-6 lg:mx-12">
        {/* Card */}
        <div className="relative grid grid-cols-1 lg:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl">
          {/* Left: hero section with animated blobs */}
          <div className="hidden lg:block relative bg-[#e0b6f5]">
            {/* Decorative floating blobs */}
            <div className="absolute inset-0 overflow-hidden">
              <svg className="absolute -left-32 -top-24 w-[520px] h-[520px] opacity-60 blur-2xl animate-blob" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
                <g transform="translate(300,300)">
                  <path d="M120,-168C160,-126,179,-63,179,-3C179,58,160,116,120,150C80,184,40,194,-8,208C-56,223,-112,241,-154,210C-196,179,-224,99,-219,28C-214,-43,-176,-86,-140,-134C-104,-182,-70,-236,-20,-240C30,-244,60,-188,120,-168Z" fill="#b57df0"/>
                </g>
              </svg>

              <svg className="absolute right-0 bottom-0 w-[420px] h-[420px] opacity-50 blur-xl animate-blob animation-delay-2000" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
                <g transform="translate(300,300)">
                  <path d="M93,-131C120,-102,155,-90,165,-61C175,-32,170,12,148,41C126,70,86,85,51,113C16,141,-20,182,-64,190C-108,198,-158,174,-171,129C-183,84,-158,22,-146,-28C-134,-79,-134,-117,-103,-144C-72,-171,-36,-186,-5,-173C25,-160,50,-119,93,-131Z" fill="#d8aaf6"/>
                </g>
              </svg>
            </div>

            {/* Main hero section */}
            <div className="relative z-10 p-10 flex flex-col h-full justify-center items-center">
              <motion.div
                className="w-80 h-80 bg-white rounded-2xl shadow-2xl flex items-center justify-center mb-8"
                initial={{ scale: 0.98, y: 8, rotate: -5 }}
                animate={{ scale: 1, y: 0, rotate: 0 }}
                transition={{ duration: 0.9, ease: "easeOut" }}
                style={{ boxShadow: "0 30px 80px rgba(160, 96, 230, 0.18)" }}
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="text-center"
                >
                  <div className="text-6xl mb-4">🔒</div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-2xl font-bold text-gray-800"
                  >
                    New Password
                  </motion.div>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="text-white text-center max-w-md"
              >
                <h3 className="text-3xl font-semibold mb-4">Reset Your Password</h3>
                <p className="text-lg opacity-90">
                  Create a strong new password for your account.
                </p>
                <p className="text-sm opacity-80 mt-2">
                  Email: {email}
                </p>
              </motion.div>

              {/* Floating security icons */}
              <motion.div
                className="absolute top-10 left-10 text-white opacity-30"
                animate={{ 
                  y: [0, -20, 0],
                  rotate: [0, 10, 0]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="text-2xl">🔑</div>
              </motion.div>
              
              <motion.div
                className="absolute bottom-16 right-16 text-white opacity-40"
                animate={{ 
                  y: [0, 15, 0],
                  rotate: [0, -15, 0]
                }}
                transition={{ 
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              >
                <div className="text-3xl">🛡️</div>
              </motion.div>
            </div>
          </div>

          {/* Right: form */}
          <div className="bg-white p-8 sm:p-12 lg:p-16 flex items-center justify-center">
            <motion.div 
              className="w-full max-w-md" 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-extrabold">Reset Password</h2>
                  <p className="mt-1 text-sm text-gray-500">Create your new password</p>
                  <p className="text-xs text-gray-400 mt-1">For: {email}</p>
                </div>
                <div className="text-sm text-gray-400">{new Date().toLocaleDateString()}</div>
              </div>

              <motion.form
                className="space-y-4"
                onSubmit={handleSubmit}
                initial={{ opacity: 0, scale: 0.98, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
              >
                <div>
                  <label className="text-xs font-semibold text-gray-500">New Password</label>
                  <div className="mt-2 relative">
                    <input
                      name="newPassword"
                      value={form.newPassword}
                      onChange={change}
                      className="block w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#e0b6f5]"
                      placeholder="Enter new password"
                      type={showPassword.newPassword ? "text" : "password"}
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('newPassword')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500"
                      disabled={loading}
                    >
                      {showPassword.newPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500">Confirm New Password</label>
                  <div className="mt-2 relative">
                    <input
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={change}
                      className="block w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#e0b6f5]"
                      placeholder="Confirm new password"
                      type={showPassword.confirmPassword ? "text" : "password"}
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('confirmPassword')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500"
                      disabled={loading}
                    >
                      {showPassword.confirmPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                {/* Password strength indicator */}
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Password Requirements:</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li className={`flex items-center ${form.newPassword.length >= 6 ? 'text-green-600' : ''}`}>
                      {form.newPassword.length >= 6 ? '✓' : '•'} At least 6 characters
                    </li>
                    <li className={`flex items-center ${/[A-Z]/.test(form.newPassword) ? 'text-green-600' : ''}`}>
                      {/[A-Z]/.test(form.newPassword) ? '✓' : '•'} One uppercase letter
                    </li>
                    <li className={`flex items-center ${/[0-9]/.test(form.newPassword) ? 'text-green-600' : ''}`}>
                      {/[0-9]/.test(form.newPassword) ? '✓' : '•'} One number
                    </li>
                  </ul>
                </div>

                <div>
                  <motion.button
                    whileHover={!loading ? { scale: 1.02 } : {}}
                    whileTap={!loading ? { scale: 0.98 } : {}}
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 rounded-xl font-semibold text-white shadow-lg ${
                      loading 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-[#7f4ce9] hover:bg-[#6e3aa8]'
                    }`}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Resetting Password...
                      </div>
                    ) : (
                      "Reset Password"
                    )}
                  </motion.button>
                </div>

                <div className="text-center text-sm text-gray-400">
                  Remember your password?{" "}
                  <a href="/login" className="text-[#6e3aa8] font-medium hover:underline">
                    Back to Login
                  </a>
                </div>
              </motion.form>
            </motion.div>
          </div>
        </div>

        {/* Footer small */}
        <div className="mt-6 text-center text-xs text-gray-400">By continuing, you agree to our Terms and Privacy Policy.</div>
      </div>

      {/* Styles for subtle animations */}
      <style jsx>{`
        .animate-blob {
          animation: blob 8s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -20px) scale(1.05);
          }
          66% {
            transform: translate(-20px, 30px) scale(0.95);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
      `}</style>
    </div>
  );
}