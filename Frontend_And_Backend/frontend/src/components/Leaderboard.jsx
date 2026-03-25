import { useEffect, useState } from 'react'
import './Leaderboard.css'
import { getLeaderboard, getWeeklyLeaderboard } from '../services/api'

function Leaderboard({ user }) {
  const [users, setUsers] = useState([])
  const [isWeekly, setIsWeekly] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (!user) {
        setUsers([])
        setError('Vui long dang nhap de xem bang xep hang')
        return
      }

      try {
        setIsLoading(true)
        setError(null)
        const data = isWeekly ? await getWeeklyLeaderboard() : await getLeaderboard()
        
        console.log('📊 [LEADERBOARD] API Response:', data)
        console.log('📊 [LEADERBOARD] Is Array:', Array.isArray(data))
        console.log('📊 [LEADERBOARD] Length:', data?.length)

        if (Array.isArray(data) && data.length > 0) {
          console.log('📊 [LEADERBOARD] First item:', data[0])
          const normalizedUsers = data
            .map((item, index) => {
              const isCurrentUser = user && (item.userId?.toLowerCase() === user.id?.toLowerCase() || item.id?.toLowerCase() === user.id?.toLowerCase() || item.username?.toLowerCase() === user.username?.toLowerCase())
              
              return {
                id: item.userId ?? item.id ?? item.Id ?? item.UserId ?? index + 1,
                name: item.username ?? item.userName ?? item.UserName ?? item.name ?? item.Name ?? `Người dùng ${index + 1}`,
                avatar: item.avatarUrl ?? item.AvatarUrl ?? '👤',
                xp: item.totalXp ?? item.TotalXP ?? item.weeklyXp ?? item.WeeklyXp ?? item.xp ?? 0,
                rank: item.rank ?? item.Rank ?? index + 1,
                streak: item.currentStreak ?? item.CurrentStreak ?? item.streak ?? item.Streak ?? 0,
                isCurrentUser: isCurrentUser
              }
            })
          
          if (normalizedUsers.length === 0) {
            setError('Chưa có người dùng nào bắt đầu học')
          } else {
            setUsers(normalizedUsers)
          }
        } else {
          console.log('📊 [BANG_XEP_HANG] Phản hồi rỗng hoặc không hợp lệ:', data)
          setError('Chưa có dữ liệu bảng xếp hạng')
        }
      } catch (error) {
        console.error('❌ [LEADERBOARD] Error fetching:', error)
        console.error('❌ [LEADERBOARD] Error message:', error.message)
        console.error('❌ [LEADERBOARD] Full error:', JSON.stringify(error))
        setError('Lỗi khi tải bảng xếp hạng')
        setUsers([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchLeaderboard()
  }, [isWeekly, user])

  const getMedalEmoji = (rank) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return rank
  }

  return (
    <div className="leaderboard-page">
      <div className="leaderboard-header">
        <h1>Bảng xếp hạng</h1>
        <p>Cạnh tranh với người học khác</p>
      </div>

      {/* Toggle Weekly/All-time */}
      <div className="leaderboard-toggle">
        <button 
          className={`toggle-btn ${!isWeekly ? 'active' : ''}`}
          onClick={() => setIsWeekly(false)}
          disabled={isLoading}
        >
          Tất cả thời gian
        </button>
        <button 
          className={`toggle-btn ${isWeekly ? 'active' : ''}`}
          onClick={() => setIsWeekly(true)}
          disabled={isLoading}
        >
          Tuần này
        </button>
      </div>

      {/* League Info */}
      <div className="league-info">
        <div className="league-badge">
          <span className="league-icon">{isWeekly ? '⚡' : '💎'}</span>
          <div className="league-details">
            <h2>{isWeekly ? 'Giải Tuần Này' : 'Giải Kim Cương'}</h2>
            <p>{isWeekly ? 'Đạt điểm cao nhất tuần này!' : 'Nhóm 10 người đầu sẽ thăng hạng!'}</p>
          </div>
        </div>
        <div className="league-timer">
          <span className="timer-icon">⏰</span>
          <span>{isWeekly ? 'Kết thúc sau 2 ngày 5 giờ' : 'Mùa giải: 2 tuần'}</span>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="leaderboard-container">
        <div className="leaderboard-table">
          {isLoading ? (
            <div className="loading-message">Đang tải...</div>
          ) : error ? (
            <div className="empty-message">{error}</div>
          ) : users.length === 0 ? (
            <div className="empty-message">Hãy bắt đầu học để có mặt trên bảng xếp hạng</div>
          ) : (
            users.map((user) => (
              <div 
                key={user.id} 
                className={`leaderboard-row ${user.isCurrentUser ? 'current-user' : ''} ${user.rank <= 3 ? 'top-three' : ''}`}
              >
                <div className="rank-badge">
                  {typeof getMedalEmoji(user.rank) === 'string' ? (
                    <span className="medal">{getMedalEmoji(user.rank)}</span>
                  ) : (
                    <span className="rank-number">{user.rank}</span>
                  )}
                </div>
                <div className="user-avatar">{user.avatar}</div>
                <div className="user-info">
                  <div className="user-name">{user.name}</div>
                </div>
                <div className="user-stats">
                  <div className="user-streak">
                    <span className="streak-flame">🔥</span>
                    {user.streak}
                  </div>
                  <div className="user-xp">
                    <span className="xp-icon">⭐</span>
                    <span className="xp-amount">{user.xp}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Promotion/Demotion Zone */}
      <div className="zone-info">
        <div className="zone promotion">
          <div className="zone-header">
            <span className="zone-icon">⬆️</span>
            <span>Khu vực thăng hạng</span>
          </div>
          <p>Nhóm 10 người đầu sẽ lên giải cao hơn</p>
        </div>
        <div className="zone safe">
          <div className="zone-header">
            <span className="zone-icon">✅</span>
            <span>Khu vực an toàn</span>
          </div>
          <p>Giữ nguyên giải hiện tại</p>
        </div>
      </div>
    </div>
  )
}

export default Leaderboard
