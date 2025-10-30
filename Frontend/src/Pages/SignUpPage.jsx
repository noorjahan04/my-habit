import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function SignupPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Password match validation
    if (form.password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Additional validation
    const errors = [];
    if (!form.email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) errors.push("Please enter a valid email.");
    if (form.password.length < 6) errors.push("Password should be at least 6 characters.");
    if (form.name.trim().length < 2) errors.push("Please enter your name.");
    if (errors.length) {
      setError(errors.join("\n"));
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch("https://my-habit-4.onrender.com/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: form.email, password: form.password, name: form.name }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Signup failed");
      } else {
        // Successful signup
        navigate("/login");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const container = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { stiffness: 120 } },
  };

  const formVariant = {
    initial: { opacity: 0, scale: 0.98, y: 8 },
    animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-[#f7f0ff]">
      <div className="relative w-full max-w-5xl mx-6 lg:mx-12">
        {/* Card */}
        <div className="relative grid grid-cols-1 lg:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl">
          {/* Left: hero image + animated blobs */}
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

            {/* Main hero image */}
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
                <h3 className="text-3xl font-semibold">Join the creative community</h3>
                <p className="mt-3 text-sm opacity-90">Sign up to collaborate, share your work, and get inspired. Smooth animations and delightful micro-interactions make everything feel alive.</p>
              </motion.div>
            </div>
          </div>

          {/* Right: form */}
          <div className="bg-white p-8 sm:p-12 lg:p-16 flex items-center justify-center">
            <motion.div className="w-full max-w-md" variants={container} initial="hidden" animate="show">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-extrabold">Create account</h2>
                  <p className="mt-1 text-sm text-gray-500">Start your journey with us</p>
                </div>
                <div className="text-sm text-gray-400">{new Date().toLocaleDateString()}</div>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm"
                >
                  {error}
                </motion.div>
              )}

              <motion.form
                className="space-y-4"
                onSubmit={handleSubmit}
                variants={formVariant}
                initial="initial"
                animate="animate"
              >
                <div>
                  <label className="text-xs font-semibold text-gray-500">Full name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={change}
                    className="mt-2 block w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#e0b6f5]"
                    placeholder="Your name"
                    type="text"
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500">Email</label>
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
                  <label className="text-xs font-semibold text-gray-500">Password</label>
                  <div className="mt-2 relative">
                    <input
                      name="password"
                      value={form.password}
                      onChange={change}
                      className="block w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#e0b6f5]"
                      placeholder="Create a password"
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

                <div>
                  <label className="text-xs font-semibold text-gray-500">Confirm Password</label>
                  <div className="mt-2 relative">
                    <input
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="block w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#e0b6f5]"
                      placeholder="Confirm your password"
                      type={showPassword ? "text" : "password"}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input 
                    id="agree" 
                    type="checkbox" 
                    className="rounded border-gray-200" 
                    required 
                    disabled={loading}
                  />
                  <label htmlFor="agree" className="text-sm text-gray-500">I agree to the <a href="#" className="text-[#6e3aa8]">Terms</a></label>
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
                        Creating account...
                      </div>
                    ) : (
                      "Create account"
                    )}
                  </motion.button>
                </div>

                <div className="text-center text-sm text-gray-400">
                  Already have an account?{" "}
                  <a href="/login" className="text-[#6e3aa8] font-medium hover:underline">
                    Sign in
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
      <style >{`
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