import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Home from './pages/Home'
import WellnessPlan from './pages/WellnessPlan'
import Insights from './pages/Insights'
import About from './pages/About'
import TherapyChat from './pages/TherapyChat'
import ShadowWork from './pages/ShadowWork'
import EmotionalRecipes from './pages/EmotionalRecipes'
import HealingMirror from './pages/HealingMirror'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/wellness-plan" element={<WellnessPlan />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/chat" element={<TherapyChat />} />
          <Route path="/shadow-work" element={<ShadowWork />} />
          <Route path="/recipes" element={<EmotionalRecipes />} />
          <Route path="/mirror" element={<HealingMirror />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
