import { useState } from 'react'
import './Auth.css'

function Auth({ onLogin, onClose, initialMode = 'login' }) {
  const [isLogin, setIsLogin] = useState(initialMode === 'login')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: ''
  })

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Simulate login/register
    if (isLogin) {
      // Login logic
      if (formData.email && formData.password) {
        onLogin({
          name: formData.name || 'User',
          email: formData.email
        })
      }
    } else {
      // Register logic
      if (formData.name && formData.email && formData.password && formData.age) {
        onLogin({
          name: formData.name,
          email: formData.email
        })
      }
    }
  }

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-container" onClick={(e) => e.stopPropagation()}>
        <button className="auth-close-btn" onClick={onClose} title="Close">
          ✕
        </button>
        <div className="auth-content">
        {/* Left side - Marketing */}
        <div className="auth-left">
          <div className="auth-logo">
            <span className="auth-logo-icon">🦉</span>
            <span className="auth-logo-text">duolingo</span>
          </div>
          <h1 className="auth-title">
            The free, fun, and effective way to learn a language!
          </h1>
          <div className="auth-features">
            <div className="auth-feature">
              <div className="feature-icon">🎯</div>
              <div className="feature-text">
                <h3>Effective and efficient</h3>
                <p>Our courses effectively and efficiently teach reading, listening, and speaking skills.</p>
              </div>
            </div>
            <div className="auth-feature">
              <div className="feature-icon">🎮</div>
              <div className="feature-text">
                <h3>Personalized learning</h3>
                <p>Combining the best of AI and language science, lessons are tailored to help you learn at just the right level and pace.</p>
              </div>
            </div>
            <div className="auth-feature">
              <div className="feature-icon">🏆</div>
              <div className="feature-text">
                <h3>Stay motivated</h3>
                <p>We make it easy to form a habit of language learning, with game-like features, fun challenges, and reminders.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Auth Form */}
        <div className="auth-right">
          <div className="auth-form-container">
            <div className="auth-tabs">
              <button 
                className={`auth-tab ${isLogin ? 'active' : ''}`}
                onClick={() => setIsLogin(true)}
              >
                LOGIN
              </button>
              <button 
                className={`auth-tab ${!isLogin ? 'active' : ''}`}
                onClick={() => setIsLogin(false)}
              >
                SIGN UP
              </button>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              {!isLogin && (
                <>
                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your name"
                      required={!isLogin}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="age">Age</label>
                    <input
                      type="number"
                      id="age"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      placeholder="Your age"
                      required={!isLogin}
                      min="1"
                    />
                  </div>
                </>
              )}

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  required
                  minLength="6"
                />
              </div>

              <button type="submit" className="auth-submit-btn">
                {isLogin ? 'LOG IN' : 'CREATE ACCOUNT'}
              </button>
            </form>

            {isLogin && (
              <div className="auth-footer">
                <a href="#" className="auth-link">Forgot password?</a>
              </div>
            )}

            <div className="auth-divider">
              <span>OR</span>
            </div>

            <div className="social-login">
              <button className="social-btn facebook">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                CONTINUE WITH FACEBOOK
              </button>
              <button className="social-btn google">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                CONTINUE WITH GOOGLE
              </button>
              <button className="social-btn apple">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                CONTINUE WITH APPLE
              </button>
            </div>

            {!isLogin && (
              <p className="auth-terms">
                By signing up, you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a>.
              </p>
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}

export default Auth
