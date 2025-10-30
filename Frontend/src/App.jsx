import { useState } from 'react'
import './App.css'
import AllRoutes from './components/AllRoutes'
import './index.css'
import { ToastContainer } from "react-toastify";
import Navbar from './components/Navbar';

function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
    <ToastContainer position="bottom-right" autoClose={3000} theme="colored" />
    <Navbar/>
    <AllRoutes/>
       
    </>
  )
}

export default App
