import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import WellnessPlan from './pages/WellnessPlan'
import Insights from './pages/Insights'
import About from './pages/About'
import TherapyChat from './pages/TherapyChat'
import ShadowWork from './pages/ShadowWork'
import EmotionalRecipes from './pages/EmotionalRecipes'
import HealingMirror from './pages/HealingMirror'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected routes - require authentication */}
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/wellness-plan" element={<ProtectedRoute><WellnessPlan /></ProtectedRoute>} />
            <Route path="/insights" element={<ProtectedRoute><Insights /></ProtectedRoute>} />
            <Route path="/chat" element={<ProtectedRoute><TherapyChat /></ProtectedRoute>} />
            <Route path="/shadow-work" element={<ProtectedRoute><ShadowWork /></ProtectedRoute>} />
            <Route path="/recipes" element={<ProtectedRoute><EmotionalRecipes /></ProtectedRoute>} />
            <Route path="/mirror" element={<ProtectedRoute><HealingMirror /></ProtectedRoute>} />
            <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
            
            {/* Catch all - redirect to login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  )
}

export default App
