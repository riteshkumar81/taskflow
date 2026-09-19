import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import { getCurrentUser, logoutUser } from './services/api'

function AppContent() {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser())

  const handleAuthSuccess = (user) => {
    setCurrentUser(user)
    navigate('/dashboard')
  }

  const handleLogout = () => {
    logoutUser()
    setCurrentUser(null)
    navigate('/login')
  }

  return (
    <Routes>
      <Route
        path="/dashboard"
        element={<Dashboard user={currentUser} onLogout={handleLogout} />}
      />
      <Route
        path="/login"
        element={<Login onAuthSuccess={handleAuthSuccess} />}
      />
      <Route
        path="/register"
        element={<Register onAuthSuccess={handleAuthSuccess} />}
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}
