import { useState } from 'react'
import './App.css'
import Learning from './components/Learning'
import Practice from './components/Practice'
import Leaderboard from './components/Leaderboard'
import Shop from './components/Shop'
import DailyStreak from './components/DailyStreak'
import Auth from './components/Auth'

function App() {
  const [user, setUser] = useState(null)
  const [currentTab, setCurrentTab] = useState('learning')
  const [streak, setStreak] = useState(7)
  const [xp, setXp] = useState(1250)
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState('login') // 'login' or 'signup'

  const handleLogin = (userData) => {
    setUser(userData)
    setShowAuth(false)
  }

  const handleLogout = () => {
    setUser(null)
  }

  const openAuth = (mode) => {
    setAuthMode(mode)
    setShowAuth(true)
  }

  const closeAuth = () => {
    setShowAuth(false)
  }

  const renderContent = () => {
    switch(currentTab) {
      case 'learning':
        return <Learning />
      case 'practice':
        return <Practice />
      case 'leaderboard':
        return <Leaderboard />
      case 'shop':
        return <Shop />
      case 'streak':
        return <DailyStreak />
      default:
        return <Learning />
    }
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <div className="logo">
            <span className="logo-icon">🦉</span>
            <span className="logo-text">Học tiếng Nhật</span>
          </div>
        </div>
        <div className="header-center">
          <nav className="nav">
            <button 
              className={`nav-btn ${currentTab === 'learning' ? 'active' : ''}`}
              onClick={() => setCurrentTab('learning')}
            >
              Học tập
            </button>
            <button 
              className={`nav-btn ${currentTab === 'practice' ? 'active' : ''}`}
              onClick={() => setCurrentTab('practice')}
            >
              Thực hành
            </button>
            <button 
              className={`nav-btn ${currentTab === 'leaderboard' ? 'active' : ''}`}
              onClick={() => setCurrentTab('leaderboard')}
            >
              Bảng xếp hạng
            </button>
            <button 
              className={`nav-btn ${currentTab === 'shop' ? 'active' : ''}`}
              onClick={() => setCurrentTab('shop')}
            >
              Cửa hàng
            </button>
          </nav>
        </div>
        <div className="header-right">
          <div 
            className={`streak ${currentTab === 'streak' ? 'active' : ''}`}
            onClick={() => setCurrentTab('streak')}
            style={{ cursor: 'pointer' }}
          >
            <span className="streak-icon">🔥</span>
            <span className="streak-count">{streak}</span>
          </div>
          <div className="xp">
            <span className="xp-icon">⭐</span>
            <span className="xp-count">{xp}</span>
          </div>
          {user ? (
            <div className="profile" onClick={handleLogout} style={{ cursor: 'pointer' }} title="Click to logout">
              <div className="profile-avatar">👤</div>
              <span className="profile-name">{user.name}</span>
            </div>
          ) : (
            <div className="auth-buttons">
              <button className="auth-header-btn login-btn" onClick={() => openAuth('login')}>
                ĐĂNG NHẬP
              </button>
              <button className="auth-header-btn signup-btn" onClick={() => openAuth('signup')}>
                ĐĂNG KÝ
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {renderContent()}
      </main>

      {/* Auth Modal */}
      {showAuth && (
        <Auth 
          onLogin={handleLogin} 
          onClose={closeAuth}
          initialMode={authMode}
        />
      )}
    </div>
  )
}

export default App
