const BASE_URL = import.meta.env.VITE_API_URL

export async function getCourses() {
  const res = await fetch(`${BASE_URL}/api/courses`)
  const data = await res.json()
  return data
}

export async function getLessons(courseId) {
  const res = await fetch(`${BASE_URL}/api/lessons/${courseId}`)
  const data = await res.json()
  return data
}

export async function getProgress(userId) {
  const res = await fetch(`${BASE_URL}/api/progress/${userId}`)
  const data = await res.json()
  return data
}

export async function markComplete(userId, lessonId) {
  const res = await fetch(`${BASE_URL}/api/progress/complete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, lesson_id: lessonId })
  })
  const data = await res.json()
  return data
}
export async function askDoubt(question, language) {
  const res = await fetch(`${BASE_URL}/api/doubt`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, language })
  })
  const data = await res.json()
  return data
}

export async function getGamification(userId) {
  const res = await fetch(`${BASE_URL}/api/gamification/${userId}`)
  const data = await res.json()
  return data
}

export async function updateStreak(userId) {
  const res = await fetch(`${BASE_URL}/api/gamification/streak/${userId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  })
  const data = await res.json()
  return data
}

export async function awardBadge(userId, badge_key, badge_name, badge_icon) {
  const res = await fetch(`${BASE_URL}/api/gamification/badge/${userId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ badge_key, badge_name, badge_icon })
  })
  const data = await res.json()
  return data
}

export async function getCertificate(userId, courseId) {
  const res = await fetch(`${BASE_URL}/api/certificates/${userId}/${courseId}`)
  const data = await res.json()
  return data
}

export async function generateCertificate(userId, courseId, studentName, courseName) {
  const res = await fetch(`${BASE_URL}/api/certificates/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id: userId,
      course_id: courseId,
      student_name: studentName,
      course_name: courseName
    })
  })
  const data = await res.json()
  return data
}