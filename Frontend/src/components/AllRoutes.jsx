import React from 'react'
import { Routes, Route } from 'react-router-dom'
import SignUpPage from '../Pages/SignUpPage'
import LoginPage from '../Pages/LoginPage'
import LandingPage from '../Pages/LandingPage'
import Dashboard from '../Pages/Dashboard'
import Habits from '../Pages/Habits'
import ResetPasswordPage from '../Pages/Change'
import Profile from '../Pages/Profile'
import GoalsPage from '../Pages/Goal'
import SoulFuel from '../Pages/SoulFuel'
import Notification from '../Pages/Notification'
import AnalyticsDashboard from '../Pages/Analytics'
import AiChat from '../Pages/Chatboat'




export default function AllRoutes() {
  return (
    <>
      <Routes>
        <Route path='/signup' element={<SignUpPage/>} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/habits' element={<Habits/>} />

        <Route path='/' element={<LandingPage/>} />
       <Route path='/dashboard' element={<Dashboard/>} />
        <Route path="/reset-password" element={<ResetPasswordPage/>} />
         <Route path="/profile" element={<Profile/>} />
         <Route path="/goals" element={<GoalsPage/>} />
        <Route path='/soulfuel' element={<SoulFuel/>} />
        <Route path='/notifications' element={<Notification/>} />
        <Route path='/analytics' element={<AnalyticsDashboard/>} /> 
        <Route path='/chatboat' element={<AiChat/>} />
      
      </Routes>
    </>
  )
}