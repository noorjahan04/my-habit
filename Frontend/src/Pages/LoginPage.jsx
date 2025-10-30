import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // ✅ Fixed handleSubmit with null checks
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!form.email || !form.password) {
      toast.warn("Please enter both email and password");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("https://my-habit-4.onrender.com/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      const data = await response.json();
      console.log("Login response:", data);

      // ✅ Check for success before accessing user fields
      if (!response.ok || !data.user) {
        toast.error(data.message || "Invalid email or password");
        setLoading(false);
        return;
      }

      // ✅ Safe to access data.user now
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.user.name || "");
      localStorage.setItem("id", data.user.id || "");
      localStorage.setItem("email", data.user.email || "");

      toast.success("Login successful!");
      console.log("Login successful:", data);
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      console.error(err);
      toast.error("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotLoading(true);

    if (!forgotEmail) {
      toast.warn("Please enter your email address");
      setForgotLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "https://my-habit-4.onrender.com/users/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: forgotEmail }),
        }
      );

      const data = await response.json();
      localStorage.setItem("rawtoken", data.rawtoken);

      if (!response.ok) {
        toast.error(data.message || "Failed to send reset email");
      } else {
        toast.success("Password reset email sent! Check your inbox.");
        setShowForgotPassword(false);
        setForgotEmail("");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error. Please try again later.");
    } finally {
      setForgotLoading(false);
    }
  };

  // Animation variants
  const container = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { stiffness: 120 } },
  };

  const formVariant = {
    initial: { opacity: 0, scale: 0.98, y: 8 },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.45, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-[#f7f0ff]">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="relative w-full max-w-5xl mx-6 lg:mx-12">
        <div className="relative grid grid-cols-1 lg:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl">
          {/* Left Hero Section */}
          <div className="hidden lg:block relative bg-[#e0b6f5]">
            <div className="absolute inset-0 overflow-hidden">
              <svg
                className="absolute -left-32 -top-24 w-[520px] h-[520px] opacity-60 blur-2xl animate-blob"
                viewBox="0 0 600 600"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g transform="translate(300,300)">
                  <path
                    d="M120,-168C160,-126,179,-63,179,-3C179,58,160,116,120,150C80,184,40,194,-8,208C-56,223,-112,241,-154,210C-196,179,-224,99,-219,28C-214,-43,-176,-86,-140,-134C-104,-182,-70,-236,-20,-240C30,-244,60,-188,120,-168Z"
                    fill="#b57df0"
                  />
                </g>
              </svg>

              <svg
                className="absolute right-0 bottom-0 w-[420px] h-[420px] opacity-50 blur-xl animate-blob animation-delay-2000"
                viewBox="0 0 600 600"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g transform="translate(300,300)">
                  <path
                    d="M93,-131C120,-102,155,-90,165,-61C175,-32,170,12,148,41C126,70,86,85,51,113C16,141,-20,182,-64,190C-108,198,-158,174,-171,129C-183,84,-158,22,-146,-28C-134,-79,-134,-117,-103,-144C-72,-171,-36,-186,-5,-173C25,-160,50,-119,93,-131Z"
                    fill="#d8aaf6"
                  />
                </g>
              </svg>
            </div>

            <div className="relative z-10 p-10 flex flex-col h-full justify-center">
              <motion.img
                src="https://i.pinimg.com/1200x/79/49/54/7949547eda9afde400b42aa4781aba05.jpg"
                alt="Collaboration"
                className="rounded-2xl shadow-xl max-w-full w-[520px] object-cover ring-8 ring-white"
                initial={{ scale: 0.98, y: 8 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ duration: 0.9, ease: "easeOut" }}
                style={{ boxShadow: "0 30px 80px rgba(160, 96, 230, 0.18)" }}
              />
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8 text-white max-w-xs"
              >
                <h3 className="text-3xl font-semibold">Welcome back!</h3>
                <p className="mt-3 text-sm opacity-90">
                  Sign in to continue your journey. Smooth animations and
                  delightful micro-interactions make everything feel alive.
                </p>
              </motion.div>
            </div>
          </div>

          {/* Right Login Section */}
          <div className="bg-white p-8 sm:p-12 lg:p-16 flex items-center justify-center">
            <motion.div
              className="w-full max-w-md"
              variants={container}
              initial="hidden"
              animate="show"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-extrabold">Welcome back</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Sign in to continue
                  </p>
                </div>
                <div className="text-sm text-gray-400">
                  {new Date().toLocaleDateString()}
                </div>
              </div>

              {/* Forgot Password / Login Forms */}
              <AnimatePresence>
                {showForgotPassword ? (
                  <motion.div
                    key="forgot-password"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="space-y-4"
                  >
                    <div className="text-center mb-4">
                      <h3 className="text-xl font-bold text-gray-900">
                        Reset Password
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Enter your email to receive a password reset link
                      </p>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-500">
                        Email
                      </label>
                      <input
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        className="mt-2 block w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#e0b6f5]"
                        placeholder="you@example.com"
                        type="email"
                        required
                        disabled={forgotLoading}
                      />
                    </div>

                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowForgotPassword(false)}
                        disabled={forgotLoading}
                        className="flex-1 py-3 rounded-xl font-semibold bg-gray-200 text-gray-700 shadow"
                      >
                        Back
                      </motion.button>
                      <motion.button
                        whileHover={!forgotLoading ? { scale: 1.02 } : {}}
                        whileTap={!forgotLoading ? { scale: 0.98 } : {}}
                        onClick={handleForgotPassword}
                        disabled={forgotLoading}
                        className={`flex-1 py-3 rounded-xl font-semibold text-white shadow-lg ${
                          forgotLoading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-[#7f4ce9] hover:bg-[#6e3aa8]"
                        }`}
                      >
                        {forgotLoading ? (
                          <div className="flex items-center justify-center">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Sending...
                          </div>
                        ) : (
                          "Send Reset Link"
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.form
                    key="login-form"
                    className="space-y-4"
                    onSubmit={handleSubmit}
                    variants={formVariant}
                    initial="initial"
                    animate="animate"
                  >
                    <div>
                      <label className="text-xs font-semibold text-gray-500">
                        Email
                      </label>
                      <input
                        name="email"
                        value={form.email}
                        onChange={change}
                        className="mt-2 block w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#e0b6f5]"
                        placeholder="you@example.com"
                        type="email"
                        required
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-500">
                        Password
                      </label>
                      <div className="mt-2 relative">
                        <input
                          name="password"
                          value={form.password}
                          onChange={change}
                          className="block w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#e0b6f5]"
                          placeholder="••••••••"
                          type={showPassword ? "text" : "password"}
                          required
                          disabled={loading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((s) => !s)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500"
                          disabled={loading}
                        >
                          {showPassword ? "Hide" : "Show"}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="inline-flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          className="rounded border-gray-200"
                          disabled={loading}
                        />
                        Remember me
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(true)}
                        className="text-sm text-[#6e3aa8] hover:underline"
                        disabled={loading}
                      >
                        Forgot password?
                      </button>
                    </div>

                    <div>
                      <motion.button
                        whileHover={!loading ? { scale: 1.02 } : {}}
                        whileTap={!loading ? { scale: 0.98 } : {}}
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 rounded-xl font-semibold text-white shadow-lg ${
                          loading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-[#c88cf1] to-[#8a5cf0] hover:from-[#b57df0] hover:to-[#7a4cd9]"
                        }`}
                      >
                        {loading ? (
                          <div className="flex items-center justify-center">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Signing in...
                          </div>
                        ) : (
                          "Sign in"
                        )}
                      </motion.button>
                    </div>

                    <div className="text-center text-sm text-gray-400">
                      Don't have an account?{" "}
                      <a
                        href="/signup"
                        className="text-[#6e3aa8] font-medium hover:underline"
                      >
                        Create one
                      </a>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-gray-400">
          By continuing, you agree to our Terms and Privacy Policy.
        </div>
      </div>

      <style>{`
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
