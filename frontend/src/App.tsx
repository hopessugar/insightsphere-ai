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
        <Routes>
          {/* Public routes - no layout */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected routes with layout */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout><Home /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/wellness-plan" element={
            <ProtectedRoute>
              <Layout><WellnessPlan /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/insights" element={
            <ProtectedRoute>
              <Layout><Insights /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/chat" element={
            <ProtectedRoute>
              <Layout><TherapyChat /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/shadow-work" element={
            <ProtectedRoute>
              <Layout><ShadowWork /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/recipes" element={
            <ProtectedRoute>
              <Layout><EmotionalRecipes /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/mirror" element={
            <ProtectedRoute>
              <Layout><HealingMirror /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/about" element={
            <ProtectedRoute>
              <Layout><About /></Layout>
            </ProtectedRoute>
          } />
          
          {/* Catch all - redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
