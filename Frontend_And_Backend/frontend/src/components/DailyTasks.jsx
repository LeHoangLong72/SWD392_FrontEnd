import { useEffect, useState } from 'react'
import { getDailyTasks, claimTaskReward } from '../services/api'
import './DailyTasks.css'

function DailyTasks({ user }) {
  const [tasks, setTasks] = useState([])
  const [tasksStatus, setTasksStatus] = useState('idle')
  const [claimingTaskId, setClaimingTaskId] = useState(null)
  const [claimToast, setClaimToast] = useState(null)

  const showToast = (message, type = 'success') => {
    if (!message) return
    setClaimToast({ message, type })
    setTimeout(() => setClaimToast(null), 3000)
  }

  const loadDailyTasks = async () => {
    if (!user) {
      setTasks([])
      setTasksStatus('guest')
      return
    }

    try {
      setTasksStatus('loading')
      const data = await getDailyTasks()
      setTasks(Array.isArray(data) ? data : [])
      setTasksStatus('ready')
    } catch (error) {
      console.error('Không thể tải nhiệm vụ hằng ngày.', error)
      setTasksStatus('error')
    }
  }

  const handleClaimTask = async (taskId) => {
    try {
      setClaimingTaskId(taskId)
      const result = await claimTaskReward(taskId)
      
      // Update task state to mark as claimed
      setTasks(prevTasks => 
        prevTasks.map(t => 
          t.taskId === taskId ? { ...t, isClaimed: true } : t
        )
      )
      
      showToast(`🎉 +${result.rewardXP}⭐ +${result.rewardGems}💎`, 'success')
    } catch (error) {
      console.error('Lỗi khi nhận thưởng nhiệm vụ:', error)
      showToast(error?.message || 'Không thể nhận thưởng', 'error')
    } finally {
      setClaimingTaskId(null)
    }
  }

  useEffect(() => {
    loadDailyTasks()
  }, [user])

  return (
    <article className="profile-panel">
      <h2>📋 Nhiệm vụ hàng ngày</h2>
      
      {tasksStatus === 'guest' && (
        <p style={{color: '#999', textAlign: 'center', padding: '1.5rem'}}>
          🔐 Đăng nhập để xem nhiệm vụ
        </p>
      )}
      
      {tasksStatus === 'loading' && (
        <p style={{color: '#999', textAlign: 'center', padding: '1.5rem'}}>
          ⏳ Đang tải nhiệm vụ...
        </p>
      )}
      
      {tasksStatus === 'error' && (
        <p style={{color: '#d32f2f', textAlign: 'center', padding: '1.5rem'}}>
          ❌ Không thể tải nhiệm vụ
        </p>
      )}
      
      {tasksStatus === 'ready' && tasks.length === 0 && (
        <p style={{color: '#999', textAlign: 'center', padding: '1.5rem'}}>
          📭 Chưa có nhiệm vụ nào
        </p>
      )}

      {tasks.length > 0 && (
        <div className="tasks-list">
          {tasks.map((task) => {
            const canClaim = task.isCompleted && !task.isClaimed
            return (
              <article 
                key={task.taskId} 
                className={`task-item ${task.isCompleted ? 'completed' : 'incomplete'}`}
              >
                <div className="task-header">
                  <h3>{task.task?.taskName || 'Nhiệm vụ'}</h3>
                  <span className={`task-status ${task.isClaimed ? 'claimed' : task.isCompleted ? 'ready' : 'pending'}`}>
                    {task.isClaimed ? '✓ Đã nhận' : task.isCompleted ? '✓ Hoàn thành' : '○ Đang làm'}
                  </span>
                </div>

                <p className="task-description">{task.task?.description || 'Không có mô tả'}</p>

                <div className="task-rewards">
                  <span className="reward-xp">⭐ {task.task?.rewardXP || 0} XP</span>
                  <span className="reward-gems">💎 {task.task?.rewardGems || 0}</span>
                </div>

                <div className="task-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{width: `${task.isCompleted ? 100 : Math.min(task.progress || 0, 100)}%`}}
                    ></div>
                  </div>
                  <span className="progress-text">{task.progress || 0}%</span>
                </div>

                <button
                  className="task-claim-btn"
                  disabled={!canClaim || claimingTaskId === task.taskId}
                  onClick={() => handleClaimTask(task.taskId)}
                >
                  {claimingTaskId === task.taskId ? 'Đang xử lý...' : 
                   task.isClaimed ? 'Đã nhận' : 
                   task.isCompleted ? 'Nhận thưởng' : 
                   'Chưa hoàn thành'}
                </button>
              </article>
            )
          })}
        </div>
      )}

      {claimToast && (
        <div className={`profile-toast ${claimToast.type}`}>
          {claimToast.message}
        </div>
      )}
    </article>
  )
}

export default DailyTasks
