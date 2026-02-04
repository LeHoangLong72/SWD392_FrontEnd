import './Leaderboard.css'

function Leaderboard() {
  const users = [
    { id: 1, name: 'Yuki Tanaka', avatar: '👨', xp: 2850, rank: 1, streak: 45 },
    { id: 2, name: 'Sakura Yamamoto', avatar: '👩', xp: 2720, rank: 2, streak: 32 },
    { id: 3, name: 'Kenji Sato', avatar: '👨‍💼', xp: 2650, rank: 3, streak: 28 },
    { id: 4, name: 'Bạn', avatar: '👤', xp: 2580, rank: 4, streak: 7, isCurrentUser: true },
    { id: 5, name: 'Hana Suzuki', avatar: '👧', xp: 2450, rank: 5, streak: 21 },
    { id: 6, name: 'Takeshi Nakamura', avatar: '👨‍🎓', xp: 2380, rank: 6, streak: 15 },
    { id: 7, name: 'Mai Kobayashi', avatar: '👩‍💻', xp: 2290, rank: 7, streak: 19 },
    { id: 8, name: 'Ryo Watanabe', avatar: '👨‍🔬', xp: 2150, rank: 8, streak: 12 },
    { id: 9, name: 'Aya Kimura', avatar: '👩‍🎨', xp: 2080, rank: 9, streak: 9 },
    { id: 10, name: 'Hiroshi Ito', avatar: '👨‍🏫', xp: 1950, rank: 10, streak: 14 }
  ]

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

      {/* League Info */}
      <div className="league-info">
        <div className="league-badge">
          <span className="league-icon">💎</span>
          <div className="league-details">
            <h2>Giải Kim Cương</h2>
            <p>Top 10 sẽ thăng hạng!</p>
          </div>
        </div>
        <div className="league-timer">
          <span className="timer-icon">⏰</span>
          <span>Kết thúc sau 2 ngày 5 giờ</span>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="leaderboard-container">
        <div className="leaderboard-table">
          {users.map((user) => (
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
                <div className="user-streak">
                  <span className="streak-flame">🔥</span>
                  {user.streak} ngày
                </div>
              </div>
              <div className="user-xp">
                <span className="xp-icon">⭐</span>
                <span className="xp-amount">{user.xp.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Promotion/Demotion Zone */}
      <div className="zone-info">
        <div className="zone promotion">
          <div className="zone-header">
            <span className="zone-icon">⬆️</span>
            <span>Khu vực thăng hạng</span>
          </div>
          <p>Top 10 sẽ lên giải cao hơn</p>
        </div>
        <div className="zone safe">
          <div className="zone-header">
            <span className="zone-icon">✅</span>
            <span>Khu vực an toàn</span>
          </div>
          <p>Giữ nguyên giải hiện tại</p>
        </div>
        <div className="zone demotion">
          <div className="zone-header">
            <span className="zone-icon">⬇️</span>
            <span>Khu vực xuống hạng</span>
          </div>
          <p>5 người cuối sẽ xuống giải</p>
        </div>
      </div>

      {/* Achievements */}
      <div className="leaderboard-achievements">
        <h3>Thành tích tuần này</h3>
        <div className="achievement-cards">
          <div className="achievement-card">
            <span className="achievement-icon">🏆</span>
            <h4>Top 10 tuần trước</h4>
          </div>
          <div className="achievement-card">
            <span className="achievement-icon">⚡</span>
            <h4>Tăng 150 XP</h4>
          </div>
          <div className="achievement-card">
            <span className="achievement-icon">🎯</span>
            <h4>5 bài hoàn thành</h4>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Leaderboard
