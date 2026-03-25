import { useState } from 'react'
import './Auth.css'
import { login, register } from '../services/api'

function Auth({ onLogin, onClose, initialMode = 'login' }) {
  const [isLogin, setIsLogin] = useState(initialMode === 'login')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    username: '',
    password: '',
    age: ''
  })

  const handleInputChange = (e) => {
    setErrorMessage('')
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setIsSubmitting(true)

      if (isLogin) {
        if (!formData.username || !formData.password) {
          setErrorMessage('Vui lòng nhập username và password.')
          return
        }

        const response = await login({
          username: formData.username,
          password: formData.password
        })

        onLogin({
          id: response.userId,
          name: response.userName || formData.username,
          username: response.userName || formData.username,
          email: response.email || '',
          avatarUrl: response.avatarUrl || '👤',
          totalXp: response.totalXp || 0,
          currentStreak: response.currentStreak || 0,
          currentHearts: response.currentHearts || 5,
          maxHearts: response.maxHearts || 5,
          level: response.level || 1,
          longestStreak: response.longestStreak || 0,
          token: response.token
        })
        // Reset form
        setFormData({
          email: '',
          name: '',
          username: '',
          password: '',
          age: ''
        })
      } else {
        if (!formData.email || !formData.username || !formData.password) {
          setErrorMessage('Vui lòng nhập đầy đủ email, username và password.')
          return
        }

        const response = await register({
          username: formData.username,
          email: formData.email,
          password: formData.password
        })

        onLogin({
          id: response.userId,
          name: response.userName || formData.username,
          username: response.userName || formData.username,
          email: response.email || formData.email,
          avatarUrl: response.avatarUrl || '👤',
          totalXp: response.totalXp || 0,
          currentStreak: response.currentStreak || 0,
          currentHearts: response.currentHearts || 5,
          maxHearts: response.maxHearts || 5,
          level: response.level || 1,
          longestStreak: response.longestStreak || 0,
          token: response.token
        })
        // Reset form
        setFormData({
          email: '',
          name: '',
          username: '',
          password: '',
          age: ''
        })
      }

      setErrorMessage('')
    } catch (error) {
      setErrorMessage(error?.message || 'Đăng nhập/đăng ký thất bại. Vui lòng kiểm tra lại thông tin.')
      console.error('Yêu cầu xác thực thất bại', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSwitchMode = (nextIsLogin) => {
    setIsLogin(nextIsLogin)
    setErrorMessage('')
    if (!nextIsLogin) {
      setFormData((prev) => ({
        ...prev,
        username: prev.username || prev.name || ''
      }))
    }
  }

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-container" onClick={(e) => e.stopPropagation()}>
        <button className="auth-close-btn" onClick={onClose} title="Đóng">
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
            Cách học ngôn ngữ miễn phí, thú vị và hiệu quả!
          </h1>
          <div className="auth-features">
            <div className="auth-feature">
              <div className="feature-icon">🎯</div>
              <div className="feature-text">
                <h3>Hiệu quả và tối ưu</h3>
                <p>Các khóa học giúp bạn rèn kỹ năng đọc, nghe và nói một cách hiệu quả.</p>
              </div>
            </div>
            <div className="auth-feature">
              <div className="feature-icon">🎮</div>
              <div className="feature-text">
                <h3>Học tập cá nhân hóa</h3>
                <p>Kết hợp AI và khoa học ngôn ngữ, bài học được điều chỉnh phù hợp với trình độ và tốc độ của bạn.</p>
              </div>
            </div>
            <div className="auth-feature">
              <div className="feature-icon">🏆</div>
              <div className="feature-text">
                <h3>Duy trì động lực</h3>
                <p>Tính năng như trò chơi, thử thách thú vị và nhắc nhở giúp bạn duy trì thói quen học mỗi ngày.</p>
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
                onClick={() => handleSwitchMode(true)}
              >
                ĐĂNG NHẬP
              </button>
              <button 
                className={`auth-tab ${!isLogin ? 'active' : ''}`}
                onClick={() => handleSwitchMode(false)}
              >
                ĐĂNG KÝ
              </button>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">{isLogin ? 'Tên đăng nhập' : 'Thư điện tử'}</label>
                <input
                  type={isLogin ? 'text' : 'email'}
                  id="email"
                  name={isLogin ? 'username' : 'email'}
                  value={isLogin ? formData.username : formData.email}
                  onChange={handleInputChange}
                  placeholder={isLogin ? 'Nhập tên đăng nhập' : 'nhap.email@vi.du'}
                  required
                />
              </div>

              {!isLogin && (
                <>
                  <div className="form-group">
                    <label htmlFor="username">Tên đăng nhập</label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      placeholder="Nhập tên đăng nhập"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="name">Tên hiển thị</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Nhập tên hiển thị"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="age">Tuổi</label>
                    <input
                      type="number"
                      id="age"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      placeholder="Nhập tuổi"
                      min="1"
                    />
                  </div>
                </>
              )}

              <div className="form-group">
                <label htmlFor="password">Mật khẩu</label>
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

              {errorMessage && <p className="auth-error-message">{errorMessage}</p>}

              <button type="submit" className="auth-submit-btn" disabled={isSubmitting}>
                {isSubmitting ? 'ĐANG XỬ LÝ...' : (isLogin ? 'ĐĂNG NHẬP' : 'TẠO TÀI KHOẢN')}
              </button>
            </form>

            {isLogin && (
              <div className="auth-footer">
                <a href="#" className="auth-link">Quên mật khẩu?</a>
              </div>
            )}

            <div className="auth-divider">
              <span>HOẶC</span>
            </div>

            <div className="social-login">
              <button className="social-btn facebook">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                TIẾP TỤC VỚI FACEBOOK
              </button>
              <button className="social-btn google">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                TIẾP TỤC VỚI GOOGLE
              </button>
              <button className="social-btn apple">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                TIẾP TỤC VỚI APPLE
              </button>
            </div>

            {!isLogin && (
              <p className="auth-terms">
                Khi đăng ký, bạn đồng ý với <a href="#">Điều khoản</a> và <a href="#">Chính sách quyền riêng tư</a>.
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
