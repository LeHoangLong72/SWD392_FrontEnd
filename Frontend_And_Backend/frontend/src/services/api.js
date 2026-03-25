const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL
const API_BASE_URLS = configuredBaseUrl
  ? [configuredBaseUrl.replace(/\/$/, '')]
  : ['http://localhost:7001', 'http://localhost:5195', 'http://localhost:7232']
const API_BASE_URL = API_BASE_URLS[0]
const TOKEN_STORAGE_KEY = 'auth_token'

function getStoredToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY)
}

function setStoredToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token)
  }
}

function clearStoredToken() {
  localStorage.removeItem(TOKEN_STORAGE_KEY)
}

async function request(path, options = {}) {
  const { requiresAuth = false, ...fetchOptions } = options
  const token = getStoredToken()
  const authHeaders = requiresAuth && token ? { Authorization: `Bearer ${token}` } : {}

  let response = null
  let lastNetworkError = null

  for (const baseUrl of API_BASE_URLS) {
    try {
      response = await fetch(`${baseUrl}${path}`, {
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
          ...(options.headers || {})
        },
        ...fetchOptions
      })
      break
    } catch (error) {
      lastNetworkError = error
    }
  }

  if (!response) {
    throw new Error(lastNetworkError?.message || 'Không thể kết nối tới API backend')
  }

  if (!response.ok) {
    let message = `Yêu cầu API thất bại: ${response.status}`

    try {
      const errorData = await response.json()

      if (Array.isArray(errorData)) {
        message = errorData.map((item) => item?.description || item).join(' | ')
      } else if (Array.isArray(errorData?.errors)) {
        message = errorData.errors.join(' | ')
      } else if (typeof errorData?.message === 'string') {
        message = errorData.message
      } else if (typeof errorData?.title === 'string') {
        message = errorData.title
      }
    } catch {
      // Keep default message when response body is not JSON.
    }

    throw new Error(message)
  }

  if (response.status === 204) {
    return null
  }

  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    return response.json()
  }

  const text = await response.text()
  return text || null
}

export function getShopItems(category) {
  const query = category ? `?category=${encodeURIComponent(category)}` : ''
  return request(`/api/shop/items${query}`)
}

export function getShopInventory() {
  return request('/api/shop/inventory', { requiresAuth: true })
}

export function purchaseShopItem(itemId) {
  return request('/api/shop/purchase', {
    method: 'POST',
    requiresAuth: true,
    body: JSON.stringify({ itemId })
  })
}

export function equipShopItem(itemId) {
  return request('/api/shop/equip', {
    method: 'POST',
    requiresAuth: true,
    body: JSON.stringify({ itemId })
  })
}

export function useShopItem(itemId) {
  return request(`/api/shop/use/${itemId}`, {
    method: 'POST',
    requiresAuth: true
  })
}

export function getLeaderboard() {
  return request('/api/leaderboard', { requiresAuth: true })
}

export function getHiraganaAlphabets() {
  return request('/api/alphabets/hiragana')
}

export function getKatakanaAlphabets() {
  return request('/api/alphabets/katakana')
}

export function getKanjiAlphabets(level) {
  const query = level ? `?level=${encodeURIComponent(level)}` : ''
  return request(`/api/alphabets/kanji${query}`)
}

export function login(payload) {
  return request('/api/account/login', {
    method: 'POST',
    body: JSON.stringify(payload)
  }).then(response => {
    if (response?.token) {
      setStoredToken(response.token)
    }
    return response
  })
}

export function register(payload) {
  return request('/api/account/register', {
    method: 'POST',
    body: JSON.stringify(payload)
  }).then(response => {
    if (response?.token) {
      setStoredToken(response.token)
    }
    return response
  })
}

export function getStreak() {
  return request('/api/streak', { requiresAuth: true })
}

export function getLearningPath() {
  return request('/api/learning-path/japanese-path', { requiresAuth: true })
}

export function getMyLearningProgress() {
  return request('/api/learning-path/my-progress', { requiresAuth: true })
}

export function getLearningMistakes() {
  return request('/api/learning-path/mistakes', { requiresAuth: true })
}

export function startLessonAttempt(lessonId) {
  return request(`/api/lesson-attempt/start/${lessonId}`, {
    method: 'POST',
    requiresAuth: true
  })
}

export function getLessonContent(lessonId) {
  return request(`/api/lesson-attempt/${lessonId}`, {
    requiresAuth: true
  })
}

export function submitLessonAnswer(attemptId, payload) {
  return request(`/api/lesson-attempt/submit-answer/${attemptId}`, {
    method: 'POST',
    requiresAuth: true,
    body: JSON.stringify(payload)
  })
}

export function completeLessonAttempt(attemptId) {
  return request(`/api/lesson-attempt/complete/${attemptId}`, {
    method: 'POST',
    requiresAuth: true
  })
}

export function getProfile() {
  return request('/api/profile/display', { requiresAuth: true })
}

export function updateProfile(payload) {
  return request('/api/profile/modify', {
    method: 'PUT',
    requiresAuth: true,
    body: JSON.stringify(payload)
  })
}

export function getAchievements() {
  return request('/api/achievements', { requiresAuth: true })
}

export function claimAchievementById(achievementId) {
  return request(`/api/achievements/${achievementId}/claim`, {
    method: 'POST',
    requiresAuth: true
  })
}

export function getHearts() {
  return request('/api/hearts', { requiresAuth: true })
}

export function refillHearts() {
  return request('/api/hearts/refill', {
    method: 'POST',
    requiresAuth: true
  })
}

export function practiceForHeart(payload) {
  return request('/api/hearts/practice', {
    method: 'POST',
    requiresAuth: true,
    body: JSON.stringify(payload)
  })
}

export function getWeeklyLeaderboard() {
  return request('/api/leaderboard/weekly-top3', { requiresAuth: true })
}

export function getMyLeaderboardRank() {
  return request('/api/leaderboard/my-rank', { requiresAuth: true })
}

export function getUserSummary(userId) {
  return request(`/api/profile/summary/${userId}`)
}

export function getDailyTasks() {
  return request('/api/tasks/daily', { requiresAuth: true })
}

export function claimTaskReward(taskId) {
  return request(`/api/tasks/${taskId}/claim`, {
    method: 'POST',
    requiresAuth: true
  })
}

export function getTaskProgress() {
  return request('/api/tasks/progress', { requiresAuth: true })
}

export { API_BASE_URL, getStoredToken, setStoredToken, clearStoredToken }
