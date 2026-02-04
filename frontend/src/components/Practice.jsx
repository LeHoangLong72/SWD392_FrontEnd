import { useState } from 'react'
import './Practice.css'

function Practice() {
  const [selectedPractice, setSelectedPractice] = useState(null)

  const practiceTypes = [
    {
      id: 1,
      title: 'Luyện tập kỹ năng yếu',
      description: 'Ôn tập những kỹ năng cần cải thiện',
      icon: '📚',
      color: '#FF9600',
      xp: 20,
      time: '5 phút',
      difficulty: 'medium'
    },
    {
      id: 2,
      title: 'Ôn tập lỗi sai',
      description: 'Xem lại những câu trả lời sai gần đây',
      icon: '🔄',
      color: '#FF4B4B',
      xp: 15,
      time: '3 phút',
      difficulty: 'easy'
    },
    {
      id: 3,
      title: 'Luyện tập có thời gian',
      description: 'Hoàn thành càng nhiều câu hỏi trong thời gian cho phép',
      icon: '⏱️',
      color: '#CE82FF',
      xp: 25,
      time: '10 phút',
      difficulty: 'hard'
    },
    {
      id: 4,
      title: 'Luyện nghe',
      description: 'Cải thiện kỹ năng nghe của bạn',
      icon: '🎧',
      color: '#1CB0F6',
      xp: 20,
      time: '5 phút',
      difficulty: 'medium'
    },
    {
      id: 5,
      title: 'Luyện nói',
      description: 'Thực hành phát âm tiếng Nhật',
      icon: '🎤',
      color: '#58CC02',
      xp: 20,
      time: '5 phút',
      difficulty: 'medium'
    },
    {
      id: 6,
      title: 'Ôn tập Hiragana',
      description: 'Luyện tập bảng chữ cái Hiragana',
      icon: 'あ',
      color: '#FF6B9D',
      xp: 15,
      time: '3 phút',
      difficulty: 'easy'
    },
    {
      id: 7,
      title: 'Ôn tập Katakana',
      description: 'Luyện tập bảng chữ cái Katakana',
      icon: 'カ',
      color: '#00CD9C',
      xp: 15,
      time: '3 phút',
      difficulty: 'easy'
    },
    {
      id: 8,
      title: 'Luyện từ vựng',
      description: 'Ôn tập từ vựng đã học',
      icon: '📝',
      color: '#FFB800',
      xp: 20,
      time: '5 phút',
      difficulty: 'medium'
    },
    {
      id: 9,
      title: 'Luyện ngữ pháp',
      description: 'Thực hành cấu trúc ngữ pháp',
      icon: '📖',
      color: '#6C47FF',
      xp: 25,
      time: '7 phút',
      difficulty: 'hard'
    }
  ]

  const handleStartPractice = (practice) => {
    setSelectedPractice(practice)
    alert(`Bắt đầu: ${practice.title}\n+${practice.xp} XP khi hoàn thành!`)
  }

  const getDifficultyBadge = (difficulty) => {
    const badges = {
      easy: { text: 'Dễ', color: '#58CC02' },
      medium: { text: 'Trung bình', color: '#FF9600' },
      hard: { text: 'Khó', color: '#FF4B4B' }
    }
    return badges[difficulty]
  }

  return (
    <div className="practice-page">
      <div className="practice-header">
        <h1>Thực hành</h1>
        <p>Nâng cao kỹ năng tiếng Nhật của bạn</p>
      </div>

      {/* Daily Challenge */}
      <div className="daily-challenge">
        <div className="challenge-badge">
          <span className="challenge-icon">🎯</span>
          <span className="challenge-label">Thử thách hôm nay</span>
        </div>
        <div className="challenge-content">
          <h2>Hoàn thành 3 bài luyện tập hôm nay!</h2>
          <div className="challenge-progress">
            <div className="progress-bar-container">
              <div className="challenge-progress-bar" style={{ width: '33%' }}></div>
            </div>
            <span className="challenge-count">1/3</span>
          </div>
          <p className="challenge-reward">🎁 Phần thưởng: +50 XP</p>
        </div>
      </div>

      {/* Practice Grid */}
      <div className="practice-grid">
        {practiceTypes.map((practice) => {
          const difficulty = getDifficultyBadge(practice.difficulty)
          return (
            <div
              key={practice.id}
              className="practice-card"
              onClick={() => handleStartPractice(practice)}
              style={{ borderLeftColor: practice.color }}
            >
              <div className="practice-icon-wrapper" style={{ background: `${practice.color}20` }}>
                <span className="practice-icon" style={{ color: practice.color }}>
                  {practice.icon}
                </span>
              </div>
              <div className="practice-content">
                <h3>{practice.title}</h3>
                <p>{practice.description}</p>
                <div className="practice-meta">
                  <span className="practice-time">
                    <span className="meta-icon">⏱️</span>
                    {practice.time}
                  </span>
                  <span className="practice-xp">
                    <span className="meta-icon">⭐</span>
                    +{practice.xp} XP
                  </span>
                  <span 
                    className="practice-difficulty"
                    style={{ 
                      background: `${difficulty.color}20`,
                      color: difficulty.color 
                    }}
                  >
                    {difficulty.text}
                  </span>
                </div>
              </div>
              <button className="practice-start-btn" style={{ background: practice.color }}>
                Bắt đầu
              </button>
            </div>
          )
        })}
      </div>

      {/* Stats Section */}
      <div className="practice-stats">
        <h2>Thống kê luyện tập</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-icon">🔥</span>
            <h3>7 ngày</h3>
            <p>Chuỗi luyện tập</p>
          </div>
          <div className="stat-card">
            <span className="stat-icon">✅</span>
            <h3>45</h3>
            <p>Bài hoàn thành</p>
          </div>
          <div className="stat-card">
            <span className="stat-icon">⏱️</span>
            <h3>180 phút</h3>
            <p>Tổng thời gian</p>
          </div>
          <div className="stat-card">
            <span className="stat-icon">🎯</span>
            <h3>92%</h3>
            <p>Độ chính xác</p>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="practice-tips">
        <h3>💡 Mẹo học tập</h3>
        <ul>
          <li>Luyện tập đều đặn mỗi ngày để duy trì tiến độ</li>
          <li>Tập trung vào những kỹ năng yếu để cải thiện nhanh hơn</li>
          <li>Sử dụng luyện tập có thời gian để thử thách bản thân</li>
          <li>Đừng quên ôn tập những bài đã hoàn thành</li>
        </ul>
      </div>
    </div>
  )
}

export default Practice
