import { useEffect, useState } from 'react'
import './DailyStreak.css'
import { getHearts, getMyLearningProgress, getStreak } from '../services/api'

function DailyStreak({ user, streak = 7 }) {
  const [hearts, setHearts] = useState(null)
  const [maxHearts, setMaxHearts] = useState(5)
  const [lessonsCompleted, setLessonsCompleted] = useState(0)
  const [lessonGoal] = useState(20)
  const [todayXp, setTodayXp] = useState(0)
  const [currentStreak, setCurrentStreak] = useState(streak)
  const [weeklyProgress, setWeeklyProgress] = useState([false, false, false, false, false, false, false])

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        return
      }

      try {
        // Fetch hearts
        const heartsData = await getHearts()
        if (heartsData) {
          setHearts(heartsData.currentHearts || 0)
          setMaxHearts(heartsData.maxHearts || 5)
        }

        // Fetch streak
        const streakData = await getStreak()
        if (streakData) {
          setCurrentStreak(streakData.currentStreak || 0)
        }

        // Fetch progress data
        const progressData = await getMyLearningProgress()
        if (Array.isArray(progressData)) {
          const today = new Date().toISOString().slice(0, 10)
          const todayProgress = progressData.filter((item) => (item.completedDate || '').slice(0, 10) === today)
          
          const totalTodayXp = todayProgress.reduce((sum, item) => sum + (item.earnedXP || 0), 0)
          setTodayXp(totalTodayXp)
          setLessonsCompleted(todayProgress.length)

          // Calculate weekly progress (last 7 days)
          const weeklyDays = [false, false, false, false, false, false, false]
          const today2 = new Date()
          
          for (let i = 0; i < 7; i++) {
            const date = new Date(today2)
            date.setDate(date.getDate() - (6 - i))
            const dateStr = date.toISOString().slice(0, 10)
            
            const hasProgress = progressData.some((item) => (item.completedDate || '').slice(0, 10) === dateStr)
            weeklyDays[i] = hasProgress
          }
          
          setWeeklyProgress(weeklyDays)
        }
      } catch (error) {
        console.error('Không thể tải dữ liệu thành tích hằng ngày:', error)
      }
    }

    fetchData()
  }, [user])

  return (
    <div className="daily-streak-container">
      <h2 className="streak-title">Thành tích hôm nay</h2>
      
      <div className="streak-cards">
        {/* Hearts Card */}
        <div className="streak-card hearts-card">
          <div className="card-content">
            <div className="hearts-display">
              {[...Array(maxHearts)].map((_, index) => (
                <span key={index} className={`heart-icon ${index < (hearts || 0) ? 'active' : 'empty'}`}>
                  {index < (hearts || 0) ? '❤️' : '🤍'}
                </span>
              ))}
            </div>
            <h3 className="card-title">Mạng sống</h3>
            <div className="card-stats">
              <span className="stat-number">{hearts || 0}</span>
              <span className="stat-total">/ {maxHearts}</span>
            </div>
            <p className="card-description">Các mạng sống phục hồi mỗi ngày</p>
          </div>
        </div>

        {/* Lesson Completion Card */}
        <div className="streak-card lesson-card">
          <div className="card-content">
            <div className="duo-mascot">
              <div className="duo-owl">🦉</div>
              <div className="duo-sparkle">✨</div>
            </div>
            <h3 className="card-title">Bài học hoàn thành</h3>
            <div className="card-stats">
              <span className="stat-number">{lessonsCompleted}</span>
              <span className="stat-total">/ {lessonGoal}</span>
            </div>
            <div className="xp-display">XP hôm nay: {todayXp}</div>
            <p className="card-description">Tiếp tục để đạt mục tiêu hàng ngày!</p>
          </div>
        </div>

        {/* 7 Day Streak Card */}
        <div className="streak-card fire-card">
          <div className="card-content">
            <div className="fire-icon-wrapper">
              <div className="fire-icon">🔥</div>
            </div>
            <h3 className="card-title">{currentStreak} ngày liên tiếp!</h3>
            <div className="streak-days">
              {[...Array(7)].map((_, index) => (
                <div 
                  key={index} 
                  className={`day-dot ${index < currentStreak ? 'active' : ''}`}
                >
                  {index < currentStreak ? '🔥' : '○'}
                </div>
              ))}
            </div>
            <p className="card-description">Hoàn thành một bài học để giữ chuỗi!</p>
          </div>
        </div>
      </div>

      {/* Weekly Progress */}
      <div className="weekly-progress">
        <h3>Tuần này</h3>
        <div className="week-days">
          {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day, index) => (
            <div key={index} className={`day-item ${weeklyProgress[index] ? 'completed' : ''}`}>
              <div className="day-label">{day}</div>
              <div className="day-indicator">
                {weeklyProgress[index] ? '✓' : '○'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DailyStreak
