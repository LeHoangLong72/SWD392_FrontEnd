import { useState } from 'react'
import './DailyStreak.css'

function DailyStreak() {
  const [lessonsCompleted] = useState(13)
  const [streak] = useState(7)
  const [lessonGoal] = useState(20)

  return (
    <div className="daily-streak-container">
      <h2 className="streak-title">Thành tích hôm nay</h2>
      
      <div className="streak-cards">
        {/* Lesson Completion Card */}
        <div className="streak-card lesson-card">
          <div className="card-content">
            <div className="duo-mascot">
              <div className="duo-owl">🦉</div>
              <div className="duo-sparkle">✨</div>
            </div>
            <h3 className="card-title">Lesson Completed</h3>
            <div className="card-stats">
              <span className="stat-number">{lessonsCompleted}</span>
              <span className="stat-total">/ {lessonGoal}</span>
            </div>
            <p className="card-description">You're on track to reach your daily goal!</p>
            <button className="continue-btn">CONTINUE</button>
          </div>
        </div>

        {/* 7 Day Streak Card */}
        <div className="streak-card fire-card">
          <div className="card-content">
            <div className="fire-icon-wrapper">
              <div className="fire-icon">🔥</div>
            </div>
            <h3 className="card-title">{streak} Day Streak!</h3>
            <div className="streak-days">
              {[...Array(7)].map((_, index) => (
                <div 
                  key={index} 
                  className={`day-dot ${index < streak ? 'active' : ''}`}
                >
                  {index < streak ? '🔥' : '○'}
                </div>
              ))}
            </div>
            <p className="card-description">Complete a lesson to keep your streak alive!</p>
            <button className="continue-btn orange">CONTINUE</button>
          </div>
        </div>
      </div>

      {/* Weekly Progress */}
      <div className="weekly-progress">
        <h3>Tuần này</h3>
        <div className="week-days">
          {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day, index) => (
            <div key={index} className={`day-item ${index < 5 ? 'completed' : ''}`}>
              <div className="day-label">{day}</div>
              <div className="day-indicator">
                {index < 5 ? '✓' : '○'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DailyStreak
