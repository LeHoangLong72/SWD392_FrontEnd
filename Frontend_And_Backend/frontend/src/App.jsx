import { useCallback, useEffect, useRef, useState } from 'react'
import './App.css'
import Learning from './components/Learning'
import Practice from './components/Practice'
import Leaderboard from './components/Leaderboard'
import Shop from './components/Shop'
import DailyStreak from './components/DailyStreak'
import Alphabet from './components/Alphabet'
import Auth from './components/Auth'
import ProfilePage from './components/ProfilePage'
import { clearStoredToken, getProfile, getStreak, setStoredToken } from './services/api'

const USER_STORAGE_KEY = 'auth_user'

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(USER_STORAGE_KEY)
    return saved ? JSON.parse(saved) : null
  })
  const [currentTab, setCurrentTab] = useState('learning')
  const [streak, setStreak] = useState(0)
  const [xp, setXp] = useState(0)
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState('login') // 'login' or 'signup'
  const [showProfilePopover, setShowProfilePopover] = useState(false)
  const [profileStats, setProfileStats] = useState({
    hearts: null,
    level: null
  })
  const profilePopoverRef = useRef(null)

  useEffect(() => {
    const fetchStreak = async () => {
      if (!user) {
        setStreak(0)
        return
      }

      try {
        const data = await getStreak()
        if (typeof data?.currentStreak === 'number') {
          setStreak(data.currentStreak)
        }
      } catch (error) {
        console.error('Không thể tải chuỗi học, dùng dữ liệu dự phòng.', error)
      }
    }

    fetchStreak()
  }, [user])

  const syncProfile = useCallback(async () => {
    if (!user) {
      return
    }

    try {
      const profile = await getProfile()
      const backendName = profile?.username || profile?.userName || user.name || user.username

      // Sync XP from profile
      if (typeof profile?.totalXP === 'number') {
        setXp(profile.totalXP)
      }

      setUser((prev) => {
        if (!prev) {
          return prev
        }

        const nextUser = {
          ...prev,
          name: backendName || prev.name,
          username: profile?.username || profile?.userName || prev.username,
          email: profile?.email || prev.email
        }

        if (
          nextUser.name === prev.name
          && nextUser.username === prev.username
          && nextUser.email === prev.email
        ) {
          return prev
        }

        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser))
        return nextUser
      })

      if (typeof profile?.totalXP === 'number') {
        setXp(profile.totalXP)
      }

      setProfileStats({
        hearts: typeof profile?.hearts === 'number' ? profile.hearts : null,
        level: typeof profile?.level === 'number' ? profile.level : null
      })
    } catch (error) {
      console.error('Không thể tải hồ sơ, dùng dữ liệu cục bộ.', error)
    }
  }, [user])

  useEffect(() => {
    syncProfile()
  }, [syncProfile])

  const handleLogin = (userData) => {
    if (userData?.token) {
      setStoredToken(userData.token)
    }

    const safeUser = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      username: userData.username,
      avatarUrl: userData.avatarUrl,
      totalXp: userData.totalXp,
      currentStreak: userData.currentStreak,
      currentHearts: userData.currentHearts,
      maxHearts: userData.maxHearts,
      level: userData.level,
      longestStreak: userData.longestStreak
    }

    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(safeUser))
    setUser(safeUser)
    setStreak(userData?.currentStreak ?? 0)
    setXp(userData?.totalXp ?? 0)
    setShowAuth(false)
  }

  const handleLogout = () => {
    clearStoredToken()
    localStorage.removeItem(USER_STORAGE_KEY)
    setUser(null)
    setStreak(0)
    setXp(0)
    setShowProfilePopover(false)
  }

  const openAuth = (mode) => {
    setAuthMode(mode)
    setShowAuth(true)
  }

  const closeAuth = () => {
    setShowAuth(false)
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!profilePopoverRef.current?.contains(event.target)) {
        setShowProfilePopover(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const renderContent = () => {
    switch(currentTab) {
      case 'learning':
        return <Learning user={user} onRefreshProfile={syncProfile} />
      case 'practice':
        return <Practice user={user} />
      case 'leaderboard':
        return <Leaderboard user={user} />
      case 'alphabet':
        return <Alphabet user={user} />
      case 'shop':
        return <Shop user={user} />
      case 'streak':
        return <DailyStreak user={user} streak={streak} />
      case 'profile':
        return <ProfilePage user={user} xp={xp} streak={streak} onProfileUpdate={(updatedUser) => {
          setUser(prev => ({ ...prev, ...updatedUser }))
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify({ ...user, ...updatedUser }))
        }} />
      default:
        return <Learning user={user} onRefreshProfile={syncProfile} />
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
              className={`nav-btn ${currentTab === 'alphabet' ? 'active' : ''}`}
              onClick={() => setCurrentTab('alphabet')}
            >
              Chữ cái
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
            <span className="xp-count">{user ? xp : 0}</span>
          </div>
          {user ? (
            <div className="profile-wrapper" ref={profilePopoverRef}>
              <button
                className="profile"
                title="Thông tin tài khoản"
                onClick={() => setShowProfilePopover((prev) => !prev)}
              >
                <div className="profile-avatar">{user.avatarUrl || '👤'}</div>
                <span className="profile-name">{user.name}</span>
              </button>
              {showProfilePopover && (
                <div className="profile-popover">
                  <h4>{user.username || user.name}</h4>
                  <p>{user.email || 'Khong co email'}</p>
                  <div className="profile-popover-stats">
                    <span>XP: {xp}</span>
                    <span>Mạng sống: {profileStats.hearts ?? streak}</span>
                    <span>Cấp độ: {profileStats.level ?? '-'}</span>
                  </div>
                  <button
                    className="profile-open-btn"
                    onClick={() => {
                      setCurrentTab('profile')
                      setShowProfilePopover(false)
                    }}
                  >
                    Xem trang ho so
                  </button>
                  <button className="logout-btn" onClick={handleLogout}>
                    Đăng xuất
                  </button>
                </div>
              )}
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
