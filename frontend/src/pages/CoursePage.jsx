import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getLessons, askDoubt, markComplete, getProgress, getCourses, updateStreak, awardBadge, getGamification } from '../services/api'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'

export default function CoursePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [lessons, setLessons] = useState([])
  const [course, setCourse] = useState(null)
  const [activeLesson, setActiveLesson] = useState(null)
  const [loading, setLoading] = useState(true)
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [asking, setAsking] = useState(false)
  const [completedLessons, setCompletedLessons] = useState([])
  const [doubtOpen, setDoubtOpen] = useState(false)
  const [listening, setListening] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [badgeAlert, setBadgeAlert] = useState(null)

  useEffect(() => {
    async function fetchData() {
      const allCourses = await getCourses()
      const currentCourse = allCourses.find(c => c.id === id)
      setCourse(currentCourse)

      const lessonsData = await getLessons(id)
      setLessons(lessonsData)
      if (lessonsData.length > 0) setActiveLesson(lessonsData[0])

      if (user) {
        const progressData = await getProgress(user.id)
        setCompletedLessons(progressData.map(p => p.lesson_id))
      }

      setLoading(false)
    }
    fetchData()
  }, [id, user])

  useEffect(() => {
    window.speechSynthesis.getVoices()
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices()
    }
  }, [])

  function showBadgeAlert(title, message) {
    setBadgeAlert({ title, message })
    setTimeout(() => setBadgeAlert(null), 4000)
  }

  async function handleMarkComplete(lessonId) {
    if (!user) { navigate('/login'); return }

    const result = await markComplete(user.id, lessonId)
    console.log('Mark complete result:', result)

    if (!completedLessons.includes(lessonId)) {
      const newCompleted = [...completedLessons, lessonId]
      setCompletedLessons(newCompleted)

      // Update streak
      await updateStreak(user.id)

      // Count lessons completed in THIS course only
      const totalCompleted = newCompleted.filter(lid =>
        lessons.some(l => l.id === lid)
      ).length

      console.log('Total completed in course:', totalCompleted)

      // First lesson badge
      if (totalCompleted === 1) {
        const r = await awardBadge(user.id, 'first_step', 'First Step', '🎯')
        console.log('Badge result:', r)
        showBadgeAlert('🎯 First Step', 'You completed your first lesson!')
      }

      // 5 lessons badge
      if (totalCompleted === 5) {
        await awardBadge(user.id, 'on_fire', 'On Fire', '🔥')
        showBadgeAlert('🔥 On Fire', 'You completed 5 lessons!')
      }

      // 10 lessons badge
      if (totalCompleted === 10) {
        await awardBadge(user.id, 'scholar', 'Scholar', '📚')
        showBadgeAlert('📚 Scholar', 'You completed 10 lessons!')
      }

      // Course complete badge
      const courseCompleted = newCompleted.filter(lid =>
        lessons.some(l => l.id === lid)
      ).length === lessons.length

      if (courseCompleted) {
        await awardBadge(user.id, `course_${id}`, 'Course Champion', '🏆')
        showBadgeAlert('🏆 Course Champion', 'You completed the entire course!')
      }
    }

    // Auto move to next lesson
    const currentIndex = lessons.findIndex(l => l.id === lessonId)
    if (currentIndex < lessons.length - 1) {
      setActiveLesson(lessons[currentIndex + 1])
    }
  }

  async function handleAskDoubt() {
    if (!question.trim()) return
    setAsking(true)
    setAnswer('')
    console.log('Asking in language:', course?.language)
    const data = await askDoubt(question, course?.language || 'english')
    setAnswer(data.answer)
    setAsking(false)
  }

  function handleVoiceInput() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice input not supported in this browser. Please use Chrome!')
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    const langMap = {
      telugu: 'te-IN',
      hindi: 'hi-IN',
      tamil: 'ta-IN',
      english: 'en-US'
    }
    recognition.lang = langMap[course?.language] || 'en-US'
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.start()
    setListening(true)

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      setQuestion(transcript)
      setListening(false)
    }

    recognition.onerror = (event) => {
      console.error('Voice error:', event.error)
      setListening(false)
      alert('Could not understand. Please try again!')
    }

    recognition.onend = () => {
      setListening(false)
    }
  }

  function handleVoiceOutput() {
    if (!answer) return

    if (speaking) {
      window.speechSynthesis.cancel()
      setSpeaking(false)
      return
    }

    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(answer)

    const langMap = {
      telugu: 'te-IN',
      hindi: 'hi-IN',
      tamil: 'ta-IN',
      english: 'en-US'
    }

    const targetLang = langMap[course?.language] || 'en-US'
    const voices = window.speechSynthesis.getVoices()

    let selectedVoice = voices.find(v => v.lang === targetLang)

    if (!selectedVoice) {
      selectedVoice = voices.find(v =>
        v.lang.startsWith(targetLang.split('-')[0]) && v.name.includes('Google')
      )
    }

    if (!selectedVoice) {
      selectedVoice = voices.find(v =>
        v.lang.startsWith(targetLang.split('-')[0])
      )
    }

    if (!selectedVoice) {
      selectedVoice = voices.find(v => v.lang === 'en-IN') ||
                      voices.find(v => v.lang.startsWith('en'))
    }

    if (selectedVoice) utterance.voice = selectedVoice
    utterance.lang = selectedVoice?.lang || 'en-US'
    utterance.rate = 0.85
    utterance.pitch = 1
    utterance.volume = 1

    utterance.onstart = () => setSpeaking(true)
    utterance.onend = () => setSpeaking(false)
    utterance.onerror = () => setSpeaking(false)

    setTimeout(() => {
      window.speechSynthesis.speak(utterance)
      setSpeaking(true)
    }, 100)
  }

  function getPlaceholder() {
    switch (course?.language) {
      case 'telugu': return 'Example: Python lo list ante emi? Loop ela use cheyali?'
      case 'hindi': return 'Example: Python mein list kya hai? Loop kaise use karein?'
      case 'tamil': return 'Example: Python il list enna? Loop eppadi use seivadhu?'
      default: return 'Example: What is a list in Python? How do I use loops?'
    }
  }

  function getAILabel() {
    switch (course?.language) {
      case 'telugu': return 'Telugu lo adugandi — AI answer chestundi!'
      case 'hindi': return 'Hindi mein poochein — AI jawab dega!'
      case 'tamil': return 'Tamil il ketkoLungal — AI padhil soLlum!'
      default: return 'Ask your doubt — AI will answer instantly!'
    }
  }

  const completedCount = completedLessons.filter(lessonId =>
    lessons.some(l => l.id === lessonId)
  ).length

  const progressPercent = lessons.length > 0
    ? Math.round((completedCount / lessons.length) * 100)
    : 0

  return (
    <div className="min-h-screen bg-orange-50">
      <Navbar activePage="courses" />

      {loading ? (
        <p className="text-center text-gray-400 mt-20">Loading lessons...</p>
      ) : (
        <div className="flex h-[calc(100vh-65px)]">

          {/* LEFT — VIDEO PLAYER */}
          <div className="flex-1 flex flex-col p-8 overflow-y-auto bg-white">
            {activeLesson && (
              <>
                <h1 className="text-xl font-bold text-gray-900 mb-5">
                  {activeLesson.order_number}. {activeLesson.title}
                </h1>

                <div className="w-full rounded-2xl overflow-hidden bg-black border border-gray-100 shadow-lg"
                  style={{ aspectRatio: '16/9' }}>
                  <iframe
                    src={`${activeLesson.youtube_url}?rel=0&modestbranding=1`}
                    title={activeLesson.title}
                    className="w-full h-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                </div>

                <div className="mt-5 flex items-center gap-4">
                  <span className="text-sm text-gray-400">⏱ {activeLesson.duration_mins} mins</span>

                  {completedLessons.includes(activeLesson.id) ? (
                    <span className="bg-green-100 text-green-600 text-sm font-semibold px-5 py-2.5 rounded-xl">
                      ✅ Completed
                    </span>
                  ) : (
                    <button
                      onClick={() => handleMarkComplete(activeLesson.id)}
                      className="bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all">
                      Mark as Complete ✓
                    </button>
                  )}

                  <button
                    onClick={() => {
                      const currentIndex = lessons.findIndex(l => l.id === activeLesson.id)
                      if (currentIndex < lessons.length - 1) {
                        setActiveLesson(lessons[currentIndex + 1])
                      }
                    }}
                    className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all">
                    Next Lesson →
                  </button>
                </div>
              </>
            )}
          </div>

          {/* RIGHT — PROGRESS + LESSON LIST */}
          <div className="w-80 bg-white border-l border-gray-100 overflow-y-auto p-6">

            {course && (
              <div className="mb-4 flex items-center gap-2">
                <span className="bg-orange-50 text-orange-500 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                  {course.language}
                </span>
                <span className="text-xs text-gray-400 truncate">{course.title}</span>
              </div>
            )}

            <div className="mb-6 bg-orange-50 rounded-2xl p-4 border border-orange-100">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-bold text-gray-700 uppercase tracking-widest">Progress</p>
                <p className="text-sm font-bold text-orange-500">{progressPercent}%</p>
              </div>
              <div className="w-full bg-orange-100 rounded-full h-2">
                <div
                  className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">
                {completedCount} of {lessons.length} lessons completed
              </p>
            </div>

            <h2 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">
              Course Lessons
            </h2>
            <div className="flex flex-col gap-3">
              {lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  onClick={() => setActiveLesson(lesson)}
                  className={`p-4 rounded-xl cursor-pointer border transition-all ${
                    activeLesson?.id === lesson.id
                      ? 'bg-orange-50 border-orange-200'
                      : 'bg-gray-50 border-gray-100 hover:border-orange-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className={`text-sm font-semibold ${
                      activeLesson?.id === lesson.id ? 'text-orange-500' : 'text-gray-700'
                    }`}>
                      {lesson.order_number}. {lesson.title}
                    </p>
                    {completedLessons.includes(lesson.id) && (
                      <span className="text-green-500 text-xs">✅</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">⏱ {lesson.duration_mins} mins</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* BADGE ALERT */}
      {badgeAlert && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-white border border-orange-200 rounded-2xl shadow-xl px-6 py-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-2xl">
            {badgeAlert.title.split(' ')[0]}
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">🎉 Badge Earned!</p>
            <p className="text-orange-500 font-semibold text-sm">{badgeAlert.title}</p>
            <p className="text-gray-400 text-xs">{badgeAlert.message}</p>
          </div>
        </div>
      )}

      {/* FLOATING AI DOUBT BUTTON */}
      <button
        onClick={() => setDoubtOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-full shadow-xl shadow-orange-300 flex items-center justify-center text-2xl hover:scale-110 transition-all z-50"
        title="Ask AI Doubt">
        🤖
      </button>

      {/* AI DOUBT MODAL */}
      {doubtOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end justify-end p-8 z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md flex flex-col"
            style={{ maxHeight: '80vh' }}>

            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-orange-100 rounded-xl flex items-center justify-center text-xl">🤖</div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">AI Doubt Solver</p>
                  <p className="text-xs text-gray-400">{getAILabel()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-orange-50 text-orange-500 font-semibold px-2 py-1 rounded-full uppercase">
                  {course?.language}
                </span>
                <button
                  onClick={() => { setDoubtOpen(false); setAnswer(''); setQuestion('') }}
                  className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-sm transition-all">
                  ✕
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {answer && (
                <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 mb-4">
                  <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-2">
                    🤖 AI Answer
                  </p>
                  <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                    {answer}
                  </p>
                </div>
              )}

              {!answer && !asking && (
                <div className="text-center py-8">
                  <p className="text-4xl mb-3">💬</p>
                  <p className="text-gray-400 text-sm">{getAILabel()}</p>
                </div>
              )}

              {asking && (
                <div className="text-center py-8">
                  <p className="text-4xl mb-3 animate-pulse">🤔</p>
                  <p className="text-gray-400 text-sm">Thinking...</p>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-gray-100">
              <div className="relative">
                <textarea
                  rows={3}
                  placeholder={getPlaceholder()}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-orange-400 resize-none mb-3 pr-12"
                />
                <button
                  onClick={handleVoiceInput}
                  className={`absolute right-3 top-3 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    listening
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'bg-orange-100 text-orange-500 hover:bg-orange-200'
                  }`}>
                  🎤
                </button>
              </div>

              {listening && (
                <p className="text-center text-red-500 text-xs mb-3 animate-pulse">
                  🎤 Listening... speak now!
                </p>
              )}

              <div className="flex gap-2">
                <button
                  onClick={handleAskDoubt}
                  disabled={asking || !question.trim()}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white text-sm font-semibold py-3 rounded-xl transition-all">
                  {asking ? 'Thinking...' : 'Ask Doubt →'}
                </button>
                {answer && (
                  <button
                    onClick={handleVoiceOutput}
                    className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      speaking
                        ? 'bg-green-500 text-white animate-pulse'
                        : 'bg-green-100 text-green-600 hover:bg-green-200'
                    }`}>
                    {speaking ? '🔊 Speaking...' : '🔊 Listen'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}