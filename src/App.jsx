import React from 'react'
import Signup from './Components/Signup'
import Home from './Components/Home'
import Navbar from './Components/Navbar'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './Components/login'
import About from './Components/About'
import Collection from './Components/Collection'
import Contact from './Components/Contact'


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  )
}

export default App
