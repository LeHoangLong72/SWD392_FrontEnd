import { useEffect, useMemo, useState } from 'react'
import './ProfilePage.css'
import { claimAchievementById, getAchievements, getProfile, getStreak, refillHearts, updateProfile } from '../services/api'
import DailyTasks from './DailyTasks'

function ProfilePage({ user, xp = 0, streak = 0, onProfileUpdate = null }) {
  const [profile, setProfile] = useState(null)
  const [status, setStatus] = useState('idle')
  const [achievements, setAchievements] = useState([])
  const [achievementsStatus, setAchievementsStatus] = useState('idle')
  const [claimingAchievementId, setClaimingAchievementId] = useState(null)
  const [claimToast, setClaimToast] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({ userName: '', avatarUrl: '' })
  const [isSaving, setIsSaving] = useState(false)
  const [streakData, setStreakData] = useState(null)
  const [isRefilling, setIsRefilling] = useState(false)

  const showToast = (message, type = 'success') => {
    if (!message) {
      return
    }
    setClaimToast({ message, type })
  }

  const startEdit = () => {
    setEditForm({
      userName: profile?.username || user?.name || '',
      avatarUrl: profile?.avatarUrl || '🦉'
    })
    setIsEditing(true)
  }

  const cancelEdit = () => {
    setIsEditing(false)
    setEditForm({ userName: '', avatarUrl: '' })
  }

  const handleSaveProfile = async () => {
    if (!editForm.userName.trim()) {
      showToast('Tên hiển thị không được trống', 'error')
      return
    }

    try {
      setIsSaving(true)
      console.log('📤 Gửi cập nhật hồ sơ:', { userName: editForm.userName.trim(), avatarUrl: editForm.avatarUrl })
      
      const response = await updateProfile({
        userName: editForm.userName.trim(),
        avatarUrl: editForm.avatarUrl
      })
      
      console.log('📥 Phản hồi cập nhật hồ sơ:', response)
      
      // Check for both camelCase and PascalCase responses
      const hasId = response && (response.id || response.Id)
      if (hasId) {
        // Update profile state with new data
        setProfile(response)
        showToast('Cập nhật hồ sơ thành công! 🎉', 'success')
        setIsEditing(false)
        
        // Notify parent (App.jsx) to sync user state in header
        if (onProfileUpdate) {
          onProfileUpdate({
            name: response.username || response.UserName,
            username: response.username || response.UserName,
            avatarUrl: response.avatarUrl || response.AvatarUrl
          })
        }
      } else {
        console.error('❌ Cấu trúc phản hồi không hợp lệ:', response)
        throw new Error('Phản hồi từ máy chủ không hợp lệ')
      }
    } catch (error) {
      console.error('❌ Lỗi khi cập nhật hồ sơ:', error)
      const errorMessage = error?.message || error?.details || 'Không thể cập nhật hồ sơ'
      showToast(errorMessage, 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const avatarOptions = [
    '🦉', '🐱', '🐶', '🦁', '🐯', '🐻', '🐼', '🐨', '🐸', '🦊', '🐢', '🦅', '⭐',
    '🐭', '🐹', '🐰', '🦝', '🐘', '🦒', '🦓', '🦏', '🐄', '🐂', '🐃', '🐮', '🐑',
    '🐏', '🐐', '🦌', '🐕', '🐩', '🦮', '🐈', '🐓', '🦃', '🦚', '🦜', '🦢', '🦗',
    '🕷️', '🦟', '🦠', '🐢', '🐍', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟',
    '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆', '🦓', '🦍', '🦧', '🐒', '🐔', '🦆',
    '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🦓', '🦒', '🦘', '🐘', '🐪', '🐫'
  ]

  const loadAchievements = async () => {
    if (!user) {
      setAchievements([])
      setAchievementsStatus('guest')
      return
    }

    try {
      setAchievementsStatus('loading')
      const data = await getAchievements()
      setAchievements(Array.isArray(data) ? data : [])
      setAchievementsStatus('ready')
    } catch (error) {
      console.error('Không thể tải dữ liệu thành tích.', error)
      setAchievementsStatus('error')
    }
  }

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) {
        setProfile(null)
        setStatus('guest')
        setClaimToast(null)
        return
      }

      try {
        setStatus('loading')
        const [profileData, streakData] = await Promise.all([
          getProfile(),
          getStreak().catch(() => null)
        ])
        setProfile(profileData)
        setStreakData(streakData)
        setStatus('ready')
        setClaimToast(null)
      } catch (error) {
        console.error('Không thể tải dữ liệu trang hồ sơ.', error)
        setStatus('error')
      }
    }

    loadProfile()
    loadAchievements()
  }, [user])

  useEffect(() => {
    if (!claimToast) {
      return undefined
    }

    const timer = setTimeout(() => {
      setClaimToast(null)
    }, 2400)

    return () => clearTimeout(timer)
  }, [claimToast])

  const handleClaimAchievement = async (achievementId) => {
    try {
      setClaimingAchievementId(achievementId)
      setClaimToast(null)

      const result = await claimAchievementById(achievementId)
      showToast(result?.message || 'Nhận thành tích thành công', result?.success === false ? 'error' : 'success')

      await Promise.all([
        loadAchievements(),
        getProfile().then((data) => setProfile(data))
      ])
    } catch (error) {
      showToast(error?.message || 'Không thể nhận thành tích', 'error')
    } finally {
      setClaimingAchievementId(null)
    }
  }

  const emojiMap = {
    'footprints': '👣',
    'runner': '🏃',
    'fire': '🔥',
    'trophy': '🏆',
    'star': '⭐',
    'heart': '❤️',
    'lightning': '⚡',
    'medal': '🥇'
  }

  const getEmoji = (key) => emojiMap[key] || '🏅'

  const displayName = useMemo(() => {
    if (profile?.username) {
      return profile.username
    }
    return user?.name || user?.username || 'Người học'
  }, [profile, user])

  const displayAvatar = useMemo(() => {
    return profile?.avatarUrl || '🦉'
  }, [profile])

  const level = profile?.level ?? profile?.Level ?? '-'
  const currentHearts = profile?.hearts ?? profile?.Hearts ?? profile?.currentHearts ?? profile?.CurrentHearts ?? '-'
  const totalXP = profile?.totalXp ?? profile?.TotalXP ?? xp
  const currentStreak = profile?.currentStreak ?? profile?.CurrentStreak ?? streak
  const longestStreak = profile?.longestStreak ?? profile?.LongestStreak ?? '-'

  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-guest-card">
          <h2>Trang hồ sơ</h2>
          <p>Bạn cần đăng nhập để xem trang hồ sơ cá nhân.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="profile-page">
      <section className="profile-hero">
        <div className="profile-cover"></div>
        <div className="profile-identity">
          <div className="profile-avatar-large">{displayAvatar}</div>
          <div>
            <h1>{displayName}</h1>
            <p>@{profile?.username || user?.username || 'nguoi_hoc'}</p>
            <span className="profile-level-tag">Cấp độ {level}</span>
          </div>
        </div>
      </section>

      <section className="profile-stats-grid">
        <article className="profile-stat-card">
          <h3>Tổng XP</h3>
          <p>{Number(totalXP || 0).toLocaleString()}</p>
        </article>
        <article className="profile-stat-card">
          <h3>Chuỗi hiện tại</h3>
          <p>{currentStreak}</p>
        </article>
        <article className="profile-stat-card">
          <h3>Chuỗi dài nhất</h3>
          <p>{longestStreak}</p>
        </article>
        <article className="profile-stat-card">
          <h3>Mạng sống</h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p>{currentHearts}</p>
            {currentHearts < 5 && user && (
              <button
                onClick={async () => {
                  try {
                    setIsRefilling(true)
                    await refillHearts()
                    const updated = await getProfile()
                    setProfile(updated)
                    showToast('Làm đầy mạng sống thành công! ❤️', 'success')
                  } catch (error) {
                    showToast(error?.message || 'Không thể làm đầy mạng sống', 'error')
                  } finally {
                    setIsRefilling(false)
                  }
                }}
                disabled={isRefilling}
                style={{
                  padding: '0.25rem 0.5rem',
                  backgroundColor: '#FF6B6B',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  fontWeight: 'bold'
                }}
              >
                {isRefilling ? '...' : 'Làm mới'}
              </button>
            )}
          </div>
        </article>
      </section>

      <section className="profile-panels">
        <article className="profile-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2>Giới Thiệu</h2>
            {!isEditing && (
              <button
                onClick={startEdit}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#58CC02',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                ✏️ Chỉnh sửa
              </button>
            )}
          </div>

          {isEditing ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1rem', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 'bold', fontSize: '1.05rem' }}>Tên hiển thị:</label>
                <input
                  type="text"
                  value={editForm.userName}
                  onChange={(e) => setEditForm({ ...editForm, userName: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #58CC02',
                    borderRadius: '6px',
                    fontSize: '1rem',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit'
                  }}
                  placeholder="Nhập tên hiển thị"
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 'bold', fontSize: '1.05rem' }}>Chọn hình đại diện:</label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(3.5rem, 1fr))',
                  gap: '0.5rem',
                  maxHeight: '200px',
                  overflowY: 'auto',
                  padding: '0.5rem',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  backgroundColor: '#fff'
                }}>
                  {avatarOptions.map((avatar) => (
                    <button
                      key={avatar}
                      onClick={() => setEditForm({ ...editForm, avatarUrl: avatar })}
                      style={{
                        fontSize: '2rem',
                        border: editForm.avatarUrl === avatar ? '3px solid #58CC02' : '2px solid #ddd',
                        borderRadius: '8px',
                        padding: '0.5rem',
                        cursor: 'pointer',
                        backgroundColor: editForm.avatarUrl === avatar ? '#e8f5e9' : '#f5f5f5',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {avatar}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  style={{
                    flex: 1,
                    padding: '0.75rem 1.5rem',
                    backgroundColor: isSaving ? '#999' : '#58CC02',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: isSaving ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    transition: 'all 0.2s'
                  }}
                >
                  {isSaving ? '⏳ Đang lưu...' : '💾 Lưu'}
                </button>
                <button
                  onClick={cancelEdit}
                  disabled={isSaving}
                  style={{
                    flex: 1,
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#f0f0f0',
                    color: '#333',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    cursor: isSaving ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    transition: 'all 0.2s'
                  }}
                >
                  ✖️ Hủy
                </button>
              </div>
            </div>
          ) : (
            <ul>
              <li><strong>Tên hiển thị:</strong> {displayName}</li>
              <li><strong>Thư điện tử:</strong> {profile?.email || user?.email || 'Chưa cập nhật'}</li>
              <li><strong>Hình đại diện:</strong> {displayAvatar}</li>
              <li><strong>Trạng thái:</strong> {status === 'loading' ? 'Đang đồng bộ...' : 'Sẵn sàng'}</li>
            </ul>
          )}
        </article>

        <DailyTasks user={user} />

        <article className="profile-panel">
          <h2>Thành tích</h2>
          {achievementsStatus === 'loading' && <p style={{color: '#999', textAlign: 'center', padding: '1.5rem'}}>⏳ Đang tải thành tích...</p>}
          {achievementsStatus === 'error' && (
            <p style={{color: '#d32f2f', textAlign: 'center', padding: '1.5rem'}}>❌ Không thể tải thành tích</p>
          )}
          {achievementsStatus === 'ready' && achievements.length === 0 && (
            <p style={{color: '#999', textAlign: 'center', padding: '1.5rem'}}>🎯 Chưa có thành tích nào</p>
          )}
          {achievements.length > 0 && (
            <div className="achievement-list">
              {achievements.map((achievement) => {
                const canClaim = achievement.unlocked && !achievement.isClaimed
                return (
                  <article
                    key={achievement.achievementId}
                    className={`achievement-item ${achievement.unlocked ? 'unlocked' : 'locked'}`}
                  >
                    <div className="achievement-icon">
                      {achievement.iconUrl ? (
                        <div className="icon-emoji">{getEmoji(achievement.iconUrl)}</div>
                      ) : (
                        <div className="icon-emoji">🏅</div>
                      )}
                    </div>
                    <div className="achievement-main">
                      <h3>{achievement.name}</h3>
                      <p className="achievement-description">{achievement.description}</p>
                      <p className="achievement-progress">
                        Mục tiêu: {achievement.requiredValue}/{achievement.requiredValue}
                      </p>
                    </div>
                    <div className="achievement-actions">
                      <span className={`achievement-badge ${achievement.unlocked ? 'unlocked' : 'locked'}`}>
                        {achievement.isClaimed ? 'Đã nhận' : achievement.unlocked ? 'Đã mở khóa' : 'Đã khóa'}
                      </span>
                      <button
                        className="achievement-claim-btn"
                        disabled={!canClaim || claimingAchievementId === achievement.achievementId}
                        onClick={() => handleClaimAchievement(achievement.achievementId)}
                      >
                        {claimingAchievementId === achievement.achievementId ? 'Đang nhận...' : 'Nhận thưởng'}
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </article>
      </section>

      {claimToast && (
        <div className={`profile-toast ${claimToast.type}`}>
          {claimToast.message}
        </div>
      )}

      {status === 'error' && !isEditing && !profile && (
        <p className="profile-warning" style={{ color: '#d32f2f', padding: '1rem', backgroundColor: '#ffebee', borderRadius: '6px', textAlign: 'center' }}>
          ⚠️ Không thể tải dữ liệu hồ sơ từ backend. Vui lòng tải lại trang.
        </p>
      )}
    </div>
  )
}

export default ProfilePage
