import { useState } from 'react'
import './Learning.css'

function Learning() {
  const lessons = [
    { id: 1, title: 'ひらがな 1', type: 'hiragana', level: 1, completed: true, status: 'gold', icon: '🌟' },
    { id: 2, title: 'ひらがな 2', type: 'hiragana', level: 1, completed: true, status: 'gold', icon: '✨' },
    { id: 3, title: 'かたかな 1', type: 'katakana', level: 1, completed: true, status: 'gold', icon: '💫' },
    { id: 4, title: '基本のあいさつ', type: 'phrases', level: 2, completed: false, status: 'current', icon: '👋' },
    { id: 5, title: '数字 1-10', type: 'numbers', level: 2, completed: false, status: 'locked', icon: '🔢' },
    { id: 6, title: '自己紹介', type: 'intro', level: 2, completed: false, status: 'locked', icon: '🙋' },
    { id: 7, title: '家族', type: 'family', level: 3, completed: false, status: 'locked', icon: '👨‍👩‍👧‍👦' },
    { id: 8, title: '食べ物', type: 'food', level: 3, completed: false, status: 'locked', icon: '🍱' },
  ]

  const handleLessonClick = (lesson) => {
    if (lesson.status !== 'locked') {
      alert(`レッスン開始: ${lesson.title}`)
    }
  }

  return (
    <div className="learning-content">
      {/* Left Sidebar */}
      <aside className="sidebar-left">
        <div className="language-selector">
          <div className="language-flag">🇯🇵</div>
          <div className="language-info">
            <div className="language-name">日本語</div>
            <div className="language-level">Cấp độ 2</div>
          </div>
        </div>
        <div className="daily-goal">
          <h3>Mục tiêu hôm nay</h3>
          <div className="progress-bar">
            <div className="progress-fill" style={{width: '60%'}}></div>
          </div>
          <p>12 / 20 XP</p>
        </div>
      </aside>

      {/* Learning Path */}
      <div className="learning-path">
        <div className="path-header">
          <h2>Lộ trình học tập</h2>
          <p>Thành thạo tiếng Nhật!</p>
        </div>
        
        <div className="lessons-container">
          {lessons.map((lesson, index) => (
            <div key={lesson.id} className="lesson-wrapper">
              {index > 0 && <div className="path-connector"></div>}
              <div 
                className={`lesson-card ${lesson.status}`}
                onClick={() => handleLessonClick(lesson)}
                style={{
                  marginLeft: index % 2 === 0 ? '0' : '100px'
                }}
              >
                <div className="lesson-icon">
                  {lesson.icon}
                </div>
                <div className="lesson-info">
                  <h3>{lesson.title}</h3>
                  {lesson.completed && (
                    <div className="lesson-stars">
                      <span>⭐</span>
                      <span>⭐</span>
                      <span>⭐</span>
                    </div>
                  )}
                  {lesson.status === 'current' && (
                    <div className="lesson-progress">
                      <div className="progress-circle">2/5</div>
                    </div>
                  )}
                  {lesson.status === 'locked' && (
                    <div className="lesson-locked">🔒</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Unit Progress */}
        <div className="unit-review">
          <div className="review-card">
            <div className="review-icon">📝</div>
            <h3>Ôn tập unit</h3>
            <p>Xem lại những gì đã học</p>
            <button className="review-btn" disabled>Ôn tập</button>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <aside className="sidebar-right">
        <div className="upgrade-card">
          <div className="super-duo">
            <span className="super-icon">👑</span>
            <h3>Học tiếng Nhật Pro</h3>
          </div>
          <ul className="super-benefits">
            <li>✓ Không có quảng cáo</li>
            <li>✓ Trái tim không giới hạn</li>
            <li>✓ Bài tập được cá nhân hóa</li>
          </ul>
          <button className="upgrade-btn">Dùng thử 2 tuần miễn phí</button>
        </div>

        <div className="achievements">
          <h3>Thành tích</h3>
          <div className="achievement-list">
            <div className="achievement">🏆 Học 7 ngày liên tục</div>
            <div className="achievement">📚 Hoàn thành 10 bài</div>
            <div className="achievement">⚡ Tốc độ học nhanh</div>
          </div>
        </div>
      </aside>
    </div>
  )
}

export default Learning
