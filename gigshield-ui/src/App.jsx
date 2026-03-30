import { useState } from 'react'
import './index.css'
import WorkerApp from './components/WorkerApp'
import AdminDashboard from './components/AdminDashboard'
import LandingPage from './components/LandingPage'
import { useTheme } from './context/ThemeContext'

function App() {
  const [view, setView] = useState('landing')
  const { isDark } = useTheme()

  return (
    <div className="min-h-screen bg-dark">
      {view === 'landing' && <LandingPage onNavigate={setView} />}
      {view === 'worker' && <WorkerApp onBack={() => setView('landing')} />}
      {view === 'admin' && <AdminDashboard onBack={() => setView('landing')} />}
    </div>
  )
}

export default App