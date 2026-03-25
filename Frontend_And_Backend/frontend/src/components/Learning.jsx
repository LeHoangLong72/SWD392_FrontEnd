import { useCallback, useEffect, useMemo, useState } from 'react'
import './Learning.css'
import {
  completeLessonAttempt,
  getLessonContent,
  getLearningPath,
  getMyLearningProgress,
  startLessonAttempt,
  submitLessonAnswer
} from '../services/api'

const DEFAULT_LESSONS = [
  { id: 1, title: 'ひらがな 1', type: 'hiragana', level: 1, completed: true, status: 'gold', icon: '🌟' },
  { id: 2, title: 'ひらがな 2', type: 'hiragana', level: 1, completed: true, status: 'gold', icon: '✨' },
  { id: 3, title: 'かたかな 1', type: 'katakana', level: 1, completed: true, status: 'gold', icon: '💫' },
  { id: 4, title: '基本のあいさつ', type: 'phrases', level: 2, completed: false, status: 'current', icon: '👋' },
  { id: 5, title: '数字 1-10', type: 'numbers', level: 2, completed: false, status: 'locked', icon: '🔢' },
  { id: 6, title: '自己紹介', type: 'intro', level: 2, completed: false, status: 'locked', icon: '🙋' },
  { id: 7, title: '家族', type: 'family', level: 3, completed: false, status: 'locked', icon: '👨‍👩‍👧‍👦' },
  { id: 8, title: '食べ物', type: 'food', level: 3, completed: false, status: 'locked', icon: '🍱' }
]

const toCamelValue = (obj, camelKey, pascalKey) => obj?.[camelKey] ?? obj?.[pascalKey]

function normalizeQuestion(question) {
  const rawOptions = toCamelValue(question, 'options', 'Options') || []
  return {
    questionId: toCamelValue(question, 'questionId', 'QuestionId'),
    content: toCamelValue(question, 'content', 'Content') || '',
    options: rawOptions.map((option) => ({
      optionId: toCamelValue(option, 'optionId', 'OptionId'),
      optionText: toCamelValue(option, 'optionText', 'OptionText') || ''
    }))
  }
}

function Learning({ user, onRefreshProfile }) {
  const [lessons, setLessons] = useState(DEFAULT_LESSONS)
  const [dailyGoalXp] = useState(20)
  const [todayXp, setTodayXp] = useState(12)
  const [dataStatus, setDataStatus] = useState('fallback-no-auth')
  const [startingLessonId, setStartingLessonId] = useState(null)
  const [session, setSession] = useState(null)
  const [selectedOptionId, setSelectedOptionId] = useState(null)
  const [answerFeedback, setAnswerFeedback] = useState(null)
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false)
  const [isCompletingLesson, setIsCompletingLesson] = useState(false)
  const [completionResult, setCompletionResult] = useState(null)
  const [lessonQuestionCounts, setLessonQuestionCounts] = useState({})

  const loadLearningData = useCallback(async () => {
    if (!user) {
      setLessons(DEFAULT_LESSONS)
      setTodayXp(12)
      setDataStatus('fallback-no-auth')
      return
    }

    try {
      const [pathData, progressData] = await Promise.all([
        getLearningPath(),
        getMyLearningProgress()
      ])

      if (Array.isArray(pathData) && pathData.length > 0) {
        const firstIncompleteIndex = pathData.findIndex((lesson) => !lesson.isCompleted)
        const normalizedLessons = pathData.map((lesson, index) => {
          const isCompleted = !!lesson.isCompleted
          const isCurrent = !isCompleted && index === (firstIncompleteIndex === -1 ? pathData.length - 1 : firstIncompleteIndex)

          return {
            id: lesson.lessonId,
            title: lesson.lessonName,
            type: 'lesson',
            level: Math.floor(index / 3) + 1,
            completed: isCompleted,
            status: isCompleted ? 'gold' : (isCurrent ? 'current' : 'locked'),
            icon: DEFAULT_LESSONS[index % DEFAULT_LESSONS.length].icon
          }
        })

        setLessons(normalizedLessons)
      }

      if (Array.isArray(progressData)) {
        const today = new Date().toISOString().slice(0, 10)
        const totalTodayXp = progressData
          .filter((item) => (item.completedDate || '').slice(0, 10) === today)
          .reduce((sum, item) => sum + (item.earnedXP || 0), 0)

        setTodayXp(totalTodayXp)
      }

      setDataStatus('live')
    } catch (error) {
      console.error('Không thể tải tiến độ học, dùng dữ liệu dự phòng.', error)
      setLessons(DEFAULT_LESSONS)
      setTodayXp(12)
      setDataStatus('fallback-error')
    }
  }, [user])

  useEffect(() => {
    loadLearningData()
  }, [loadLearningData])

  useEffect(() => {
    const loadQuestionCounts = async () => {
      if (!user || lessons.length === 0) {
        setLessonQuestionCounts({})
        return
      }

      try {
        const visibleLessons = lessons.filter((lesson) => lesson.status !== 'locked')
        const results = await Promise.all(
          visibleLessons.map(async (lesson) => {
            const content = await getLessonContent(lesson.id)
            const questions = toCamelValue(content, 'questions', 'Questions') || []
            return [lesson.id, questions.length]
          })
        )

        setLessonQuestionCounts(Object.fromEntries(results))
      } catch (error) {
        console.error('Không thể tải số lượng câu hỏi của bài học.', error)
      }
    }

    loadQuestionCounts()
  }, [lessons, user])

  const completedCount = useMemo(() => lessons.filter((lesson) => lesson.completed).length, [lessons])
  const currentLevel = Math.max(1, Math.ceil(completedCount / 3))
  const progressPercent = Math.min(100, Math.round((todayXp / dailyGoalXp) * 100))
  const getLessonProgressText = (lesson) => {
    const totalQuestions = lessonQuestionCounts[lesson.id]

    if (!totalQuestions || totalQuestions <= 0) {
      return '0/0 cau'
    }

    const doneQuestions = lesson.completed ? totalQuestions : 0
    return `${doneQuestions}/${totalQuestions} cau`
  }

  const handleLessonClick = (lesson) => {
    if (lesson.status !== 'locked') {
      return
    }
  }

  const handleStartLesson = async (lesson, event) => {
    event.stopPropagation()

    if (lesson.status === 'locked') {
      return
    }

    if (!user) {
      alert('Bạn cần đăng nhập để bắt đầu bài học.')
      return
    }

    try {
      setStartingLessonId(lesson.id)
      const result = await startLessonAttempt(lesson.id)
      const rawQuestions = toCamelValue(result, 'questions', 'Questions') || []
      const normalizedQuestions = rawQuestions.map(normalizeQuestion).filter((q) => q.questionId)
      const attemptId = toCamelValue(result, 'attemptId', 'AttemptId')

      if (!attemptId || normalizedQuestions.length === 0) {
        alert('Bai hoc chua co du lieu cau hoi. Vui long thu lai sau.')
        return
      }

      setSession({
        lessonId: lesson.id,
        lessonTitle: lesson.title,
        attemptId,
        questions: normalizedQuestions,
        questionIndex: 0,
        correctAnswers: 0
      })
      setSelectedOptionId(null)
      setAnswerFeedback(null)
      setCompletionResult(null)
    } catch (error) {
      console.error('Không thể bắt đầu lượt làm bài.', error)
      alert(error?.message || 'Không thể bắt đầu bài học. Vui lòng kiểm tra đăng nhập/token hoặc thử lại sau.')
    } finally {
      setStartingLessonId(null)
    }
  }

  const currentQuestion = useMemo(() => {
    if (!session) {
      return null
    }
    return session.questions[session.questionIndex] || null
  }, [session])

  const sessionProgress = useMemo(() => {
    if (!session || session.questions.length === 0) {
      return 0
    }

    return Math.round(((session.questionIndex + 1) / session.questions.length) * 100)
  }, [session])

  const handleSubmitAnswer = async () => {
    if (!session || !currentQuestion || !selectedOptionId || answerFeedback || isSubmittingAnswer) {
      return
    }

    try {
      setIsSubmittingAnswer(true)
      const qId = currentQuestion.questionId || currentQuestion.QuestionId
      const payload = {
        questionId: qId,
        QuestionId: qId,
        selectedOptionId: selectedOptionId,
        SelectedOptionId: selectedOptionId
      }
      console.log('📤 Submitting answer:', payload)
      
      // Add timeout to prevent stuck requests
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Hết thời gian chờ yêu cầu')), 10000)
      )
      
      const result = await Promise.race([
        submitLessonAnswer(session.attemptId, payload),
        timeoutPromise
      ])

      console.log('📥 Answer response:', result)
      const isCorrect = toCamelValue(result, 'isCorrect', 'IsCorrect') === true
      setAnswerFeedback({ isCorrect })

      if (isCorrect) {
        setSession((prev) => (prev ? { ...prev, correctAnswers: prev.correctAnswers + 1 } : prev))
      }
    } catch (error) {
      console.error('❌ Không thể gửi câu trả lời:', error)
      alert(`Gửi câu trả lời thất bại: ${error?.message || 'Vui lòng thử lại'}`)
    } finally {
      setIsSubmittingAnswer(false)
    }
  }

  const handleNextQuestion = () => {
    if (!session || !answerFeedback) {
      return
    }

    setSession((prev) => {
      if (!prev) {
        return prev
      }
      return { ...prev, questionIndex: prev.questionIndex + 1 }
    })
    setSelectedOptionId(null)
    setAnswerFeedback(null)
  }

  const handleFinishLesson = async () => {
    if (!session || isCompletingLesson) {
      return
    }

    try {
      setIsCompletingLesson(true)
      const result = await completeLessonAttempt(session.attemptId)
      console.log('📊 Lesson completion result:', result)
      
      setCompletionResult({
        totalQuestions: toCamelValue(result, 'totalQuestions', 'TotalQuestions') ?? session.questions.length,
        correctAnswers: toCamelValue(result, 'correctAnswers', 'CorrectAnswers') ?? session.correctAnswers,
        isPassed: toCamelValue(result, 'isPassed', 'IsPassed') === true,
        earnedXP: toCamelValue(result, 'earnedXP', 'EarnedXP') ?? 0,
        isStreakIncreased: toCamelValue(result, 'isStreakIncreased', 'IsStreakIncreased') === true
      })
      await loadLearningData()
      // Refresh user profile to update XP display in header
      if (onRefreshProfile) {
        await onRefreshProfile()
      }
    } catch (error) {
      console.error('Không thể hoàn thành bài học.', error)
      alert('Khong the hoan thanh bai hoc. Vui long thu lai.')
    } finally {
      setIsCompletingLesson(false)
    }
  }

  const closeSession = () => {
    setSession(null)
    setSelectedOptionId(null)
    setAnswerFeedback(null)
    setCompletionResult(null)
  }

  if (session) {
    return (
      <div className="lesson-session-page">
        <div className="session-page-header">
          <button className="session-close-btn" onClick={closeSession}>Thoát</button>
          <div className="session-progress-track">
            <div className="session-progress-fill" style={{ width: `${sessionProgress}%` }}></div>
          </div>
          <div className="session-counter">
            Cau {Math.min(session.questionIndex + 1, session.questions.length)}/{session.questions.length}
          </div>
        </div>

        {!completionResult && currentQuestion && (
          <div className="session-page-content">
            <div className="session-card">
              <p className="session-lesson-title">{session.lessonTitle}</p>
              <h2 className="session-question-title">{currentQuestion.content}</h2>

              <div className="session-options session-options-page">
                {currentQuestion.options.map((option) => (
                  <button
                    key={option.optionId}
                    className={`session-option ${selectedOptionId === option.optionId ? 'selected' : ''}`}
                    onClick={() => setSelectedOptionId(option.optionId)}
                    disabled={!!answerFeedback || isSubmittingAnswer}
                  >
                    {option.optionText}
                  </button>
                ))}
              </div>
            </div>

            {answerFeedback && (
              <div className={`session-feedback-banner ${answerFeedback.isCorrect ? 'correct' : 'wrong'}`}>
                {answerFeedback.isCorrect ? 'Chinh xac! Tiep tuc nao.' : 'Chua dung, hay thu lai o cau sau.'}
              </div>
            )}

            <div className="session-page-actions">
              {!answerFeedback && (
                <button
                  className="session-btn primary"
                  onClick={handleSubmitAnswer}
                  disabled={!selectedOptionId || isSubmittingAnswer}
                >
                  {isSubmittingAnswer ? 'Dang gui...' : 'Gui dap an'}
                </button>
              )}

              {answerFeedback && session.questionIndex < session.questions.length - 1 && (
                <button className="session-btn primary" onClick={handleNextQuestion}>
                  Cau tiep theo
                </button>
              )}

              {answerFeedback && session.questionIndex === session.questions.length - 1 && (
                <button
                  className="session-btn success"
                  onClick={handleFinishLesson}
                  disabled={isCompletingLesson}
                >
                  {isCompletingLesson ? 'Dang hoan tat...' : 'Hoan thanh bai hoc'}
                </button>
              )}
            </div>
          </div>
        )}

        {completionResult && (
          <div className="session-result page-result">
            <h3>{completionResult.isPassed ? 'Bạn đã qua bài học!' : 'Bạn chưa qua bài học'}</h3>
            <p>
              Dung {completionResult.correctAnswers}/{completionResult.totalQuestions} cau
            </p>
            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#fff3cd', borderRadius: '8px', textAlign: 'center' }}>
              <p style={{ fontSize: '14px', color: '#856404', marginBottom: '8px' }}>Phần thưởng</p>
              <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#ffc107', margin: '5px 0' }}>
                ⭐ +{completionResult.earnedXP} XP
              </p>
              {completionResult.isStreakIncreased && (
                <p style={{ fontSize: '12px', color: '#856404', marginTop: '8px' }}>
                  🔥 Chuỗi liên tiếp tăng lên!
                </p>
              )}
            </div>
            <button className="session-btn primary" onClick={closeSession} style={{ marginTop: '20px' }}>
              Quay lại lộ trình
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="learning-content">
      {/* Left Sidebar */}
      <aside className="sidebar-left">
        <div className="language-selector">
          <div className="language-flag">🇯🇵</div>
          <div className="language-info">
            <div className="language-name">日本語</div>
            <div className="language-level">Cấp độ {currentLevel}</div>
          </div>
        </div>
        <div className="daily-goal">
          <h3>Mục tiêu hôm nay</h3>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>
          <p>{todayXp} / {dailyGoalXp} XP</p>
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
                      <div className="progress-circle">{getLessonProgressText(lesson)}</div>
                    </div>
                  )}
                  {lesson.status === 'locked' && (
                    <div className="lesson-locked">🔒</div>
                  )}
                  {lesson.status !== 'locked' && (
                    <button
                      className="start-lesson-btn"
                      onClick={(event) => handleStartLesson(lesson, event)}
                      disabled={startingLessonId === lesson.id}
                    >
                      {startingLessonId === lesson.id ? 'Đang bắt đầu...' : 'Bắt đầu'}
                    </button>
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
            <h3>Ôn tập bài</h3>
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
            <h3>Học tiếng Nhật nâng cao</h3>
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
