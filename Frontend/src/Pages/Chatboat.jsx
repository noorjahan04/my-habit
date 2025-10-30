import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles, Zap, Heart, Star, MessageCircle, X } from "lucide-react";

const AiChat = () => {
  const [messages, setMessages] = useState([
    { 
      text: "Hello! I'm your Wellness AI Assistant 🌟\n\nI can help you with:\n• Habit building strategies\n• Goal setting advice\n• Motivation tips\n• Wellness guidance\n• Progress tracking\n\nWhat would you like to explore today?", 
      sender: "bot",
      id: 1
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  const quickActions = [
    { icon: "💪", text: "Build better habits", prompt: "How can I build consistent daily habits?" },
    { icon: "🎯", text: "Set SMART goals", prompt: "Help me set effective goals using SMART framework" },
    { icon: "🔥", text: "Stay motivated", prompt: "Give me tips to stay motivated on my wellness journey" },
    { icon: "📊", text: "Track progress", prompt: "What's the best way to track my wellness progress?" },
    { icon: "🧘", text: "Reduce stress", prompt: "Share some stress management techniques" },
    { icon: "🌅", text: "Morning routine", prompt: "Suggest an ideal morning routine for productivity" },
  ];

  const sendMessage = async (customPrompt = null) => {
    const messageText = customPrompt || input;
    if (!messageText.trim() || isLoading) return;
    
    const userMessage = { 
      text: messageText, 
      sender: "user",
      id: Date.now()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCi306xNfJMdPF3aDzqkTScd3Z8IYN5lsM`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [{ 
                  parts: [{ 
                    text: `You are a friendly wellness and habit-building AI assistant. The user is using a wellness tracking app. Be encouraging, practical, and specific. Keep responses helpful but concise (2-3 sentences max). User message: ${messageText}`
                  }] 
                }]
              }),
            }
          );

      const data = await response.json();
      const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "I'm here to help! Let me think about that... 🌈";

      const botMessage = { 
        text: aiText, 
        sender: "bot",
        id: Date.now() + 1
      };
      
      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = { 
        text: "🌟 I'm having trouble connecting right now. Please try again later!", 
        sender: "bot",
        id: Date.now() + 1
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (prompt) => {
    sendMessage(prompt);
  };

  const clearChat = () => {
    setMessages([
      { 
        text: "Hello! I'm your Wellness AI Assistant 🌟\n\nI can help you with:\n• Habit building strategies\n• Goal setting advice\n• Motivation tips\n• Wellness guidance\n• Progress tracking\n\nWhat would you like to explore today?", 
        sender: "bot",
        id: 1
      },
    ]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const MessageBubble = ({ message }) => (
    <div className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} mb-4`}>
      <div className={`flex items-start gap-3 max-w-[85%] ${message.sender === "user" ? "flex-row-reverse" : ""}`}>
        {/* Avatar */}
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg ${
          message.sender === "user" 
            ? "bg-gradient-to-br from-[#e0b6f5] to-[#c895e4]" 
            : "bg-gradient-to-br from-gray-100 to-gray-200 border"
        }`}>
          {message.sender === "user" ? (
            <User className="w-5 h-5 text-white" />
          ) : (
            <Bot className="w-5 h-5 text-[#e0b6f5]" />
          )}
        </div>

        {/* Message */}
        <div className={`px-5 py-3 rounded-3xl shadow-lg ${
          message.sender === "user"
            ? "bg-gradient-to-br from-[#e0b6f5] to-[#c895e4] text-white rounded-br-none"
            : "bg-white text-gray-800 rounded-bl-none border border-gray-100"
        }`}>
          <p className="text-sm leading-relaxed whitespace-pre-line">{message.text}</p>
          <div className={`flex items-center gap-1 mt-2 text-xs ${
            message.sender === "user" ? "text-white/70" : "text-gray-500"
          }`}>
            {message.sender === "bot" && <Sparkles className="w-3 h-3" />}
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f4ff] to-[#f0e5ff] p-4 md:p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-block mb-4">
          <div className="w-20 h-20 bg-gradient-to-br from-[#e0b6f5] to-[#c895e4] rounded-3xl flex items-center justify-center shadow-2xl">
            <MessageCircle className="w-10 h-10 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-[#e0b6f5] to-[#c895e4] bg-clip-text text-transparent mb-2">
          Wellness AI Assistant
        </h1>
        <p className="text-gray-600 text-lg">Your personal guide to better habits and wellness 🌈</p>
      </div>

      {/* Main Chat Container */}
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-[#e0b6f5] to-[#c895e4] p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">AI Wellness Coach</h2>
                <p className="text-white/80 text-sm">Ready to help you grow! ✨</p>
              </div>
            </div>
            <button
              onClick={clearChat}
              className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        {messages.length <= 2 && (
          <div className="p-6 border-b border-gray-100 bg-gray-50">
            <h3 className="text-sm font-semibold text-gray-600 mb-4 flex items-center gap-2">
              <Star className="w-4 h-4 text-[#e0b6f5]" />
              Quick Start Questions
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action.prompt)}
                  className="p-3 bg-white rounded-2xl shadow border border-gray-200 hover:border-[#e0b6f5] transition-all duration-200 text-left"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{action.icon}</span>
                  </div>
                  <span className="text-xs font-medium text-gray-700">{action.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat Messages */}
        <div className="h-96 overflow-y-auto p-6 bg-white">
          <div className="space-y-2">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gray-100 border flex items-center justify-center">
                    <Bot className="w-5 h-5 text-[#e0b6f5]" />
                  </div>
                  <div className="bg-gray-100 px-5 py-3 rounded-3xl rounded-bl-none">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-[#e0b6f5] rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-[#e0b6f5] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-[#e0b6f5] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-gray-100 bg-white">
          <div className="flex gap-3">
            <div className="flex-1">
              <input
                type="text"
                value={input}
                placeholder="Ask about habits, goals, wellness..."
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#e0b6f5] focus:border-transparent transition-all duration-200 text-gray-700"
                disabled={isLoading}
              />
            </div>
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
              className={`px-6 py-4 rounded-2xl font-semibold transition-all duration-200 flex items-center gap-2 ${
                !input.trim() || isLoading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#e0b6f5] to-[#c895e4] text-white hover:shadow-lg"
              }`}
            >
              <Send className="w-4 h-4" />
              Send
            </button>
          </div>
          <p className="text-center text-xs text-gray-400 mt-3">
            Powered by Gemini AI • Your wellness journey starts here 🌟
          </p>
        </div>
      </div>
    </div>
  );
};

export default AiChat;