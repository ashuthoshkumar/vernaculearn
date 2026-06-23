import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getCourses, getProgress, getLessons, getGamification } from '../services/api'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'

export default function Profile() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState([])
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [gamification, setGamification] = useState({ streak: {}, badges: [] })

  useEffect(() => {
    async function fetchAll() {
      if (!user) return

      // Get profile from user metadata
      setProfile(user.user_metadata)

      // Get courses and progress
      const [courses, progress, gamData] = await Promise.all([
        getCourses(),
        getProgress(user.id),
        getGamification(user.id)
      ])

      setGamification(gamData)

      const completedLessonIds = progress.map(p => p.lesson_id)

      const courseStats = await Promise.all(
        courses.map(async (course) => {
          const lessons = await getLessons(course.id)
          const completedCount = lessons.filter(l =>
            completedLessonIds.includes(l.id)
          ).length
          const percent = lessons.length > 0
            ? Math.round((completedCount / lessons.length) * 100)
            : 0
          return { ...course, totalLessons: lessons.length, completedCount, percent }
        })
      )

      setStats(courseStats)
      setLoading(false)
    }
    fetchAll()
  }, [user])

  function getAge(dob) {
    if (!dob) return null
    const diff = new Date() - new Date(dob)
    return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000))
  }

  const totalCompleted = stats.filter(c => c.percent === 100).length
  const totalInProgress = stats.filter(c => c.percent > 0 && c.percent < 100).length
  const totalLessonsDone = stats.reduce((acc, c) => acc + c.completedCount, 0)

  const allBadges = [
    { key: 'first_step', icon: '🎯', name: 'First Step', desc: 'Complete your first lesson' },
    { key: 'on_fire', icon: '🔥', name: 'On Fire', desc: 'Complete 5 lessons' },
    { key: 'scholar', icon: '📚', name: 'Scholar', desc: 'Complete 10 lessons' },
    { key: 'course_champion', icon: '🏆', name: 'Course Champion', desc: 'Complete a full course' },
  ]

  const earnedBadgeKeys = gamification.badges.map(b => b.badge_key)

  return (
    <div className="min-h-screen bg-orange-50">
      <Navbar activePage="profile" />

      <div className="px-12 py-12 max-w-5xl mx-auto">
        {loading ? (
          <p className="text-gray-400 text-sm">Loading profile...</p>
        ) : (
          <>
            {/* PROFILE HEADER */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mb-6 flex items-center gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {profile?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-extrabold text-gray-900">
                  {profile?.full_name || 'Student'}
                </h1>
                <p className="text-gray-400 text-sm mt-1">{user?.email}</p>
                <div className="flex items-center gap-3 mt-3">
                  <span className="bg-orange-50 text-orange-500 text-xs font-semibold px-3 py-1 rounded-full">
                    🎓 Active Learner
                  </span>
                  {profile?.language && (
                    <span className="bg-gray-50 text-gray-500 text-xs font-semibold px-3 py-1 rounded-full capitalize">
                      🗣️ {profile.language}
                    </span>
                  )}
                </div>
              </div>

              {/* STREAK */}
              <div className="text-center bg-orange-50 rounded-2xl px-8 py-4 border border-orange-100">
                <p className="text-4xl font-black text-orange-500">
                  {gamification.streak?.current_streak || 0}🔥
                </p>
                <p className="text-xs text-gray-400 mt-1 font-semibold uppercase tracking-widest">
                  Day Streak
                </p>
                <p className="text-xs text-gray-300 mt-1">
                  Best: {gamification.streak?.longest_streak || 0} days
                </p>
              </div>
            </div>

            {/* STATS + DETAILS ROW */}
            <div className="grid grid-cols-2 gap-6 mb-6">

              {/* PERSONAL DETAILS */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">
                  Personal Details
                </h2>
                <div className="flex flex-col gap-4">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-widest">Full Name</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">{profile?.full_name || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-widest">Date of Birth</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">
                      {profile?.date_of_birth
                        ? `${new Date(profile.date_of_birth).toLocaleDateString('en-IN')} (${getAge(profile.date_of_birth)} yrs)`
                        : '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-widest">Preferred Language</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1 capitalize">{profile?.language || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-widest">Member Since</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">
                      {new Date(user?.created_at).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                </div>
              </div>

              {/* LEARNING STATS */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">
                  Learning Stats
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-orange-50 rounded-xl p-4 text-center">
                    <p className="text-3xl font-extrabold text-orange-500">{stats.length}</p>
                    <p className="text-xs text-gray-500 mt-1">Total Courses</p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4 text-center">
                    <p className="text-3xl font-extrabold text-green-500">{totalCompleted}</p>
                    <p className="text-xs text-gray-500 mt-1">Completed</p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4 text-center">
                    <p className="text-3xl font-extrabold text-blue-500">{totalInProgress}</p>
                    <p className="text-xs text-gray-500 mt-1">In Progress</p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4 text-center">
                    <p className="text-3xl font-extrabold text-purple-500">{totalLessonsDone}</p>
                    <p className="text-xs text-gray-500 mt-1">Lessons Done</p>
                  </div>
                </div>
              </div>
            </div>

            {/* BADGES */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
              <h2 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-6">
                🏅 Badges & Achievements
              </h2>
              <div className="grid grid-cols-4 gap-4">
                {allBadges.map((badge) => {
                  const earned = earnedBadgeKeys.some(k => k === badge.key || k.startsWith('course_'))
                  return (
                    <div
                      key={badge.key}
                      className={`rounded-2xl p-4 text-center border transition-all ${
                        earned
                          ? 'bg-orange-50 border-orange-200 shadow-sm'
                          : 'bg-gray-50 border-gray-100 opacity-40'
                      }`}
                    >
                      <p className="text-3xl mb-2">{badge.icon}</p>
                      <p className={`text-xs font-bold mb-1 ${earned ? 'text-orange-500' : 'text-gray-400'}`}>
                        {badge.name}
                      </p>
                      <p className="text-xs text-gray-400 leading-tight">{badge.desc}</p>
                      {earned && (
                        <span className="inline-block mt-2 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
                          Earned ✓
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* COURSE PROGRESS */}
            <h2 className="text-lg font-extrabold text-gray-900 mb-4">My Courses</h2>
            <div className="flex flex-col gap-4">
              {stats.filter(c => c.completedCount > 0).length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
                  <p className="text-3xl mb-3">📚</p>
                  <p className="text-gray-500 font-semibold">No courses started yet!</p>
                  <button
                    onClick={() => navigate('/courses')}
                    className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-xl text-sm font-semibold hover:bg-orange-600 transition-all">
                    Browse Courses →
                  </button>
                </div>
              ) : (
                stats.filter(c => c.completedCount > 0).map((course) => (
                  <div
                    key={course.id}
                    onClick={() => navigate(`/courses/${course.id}`)}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-base font-bold text-gray-900">{course.title}</h3>
                        <span className="text-xs font-semibold uppercase tracking-widest text-orange-500">
                          {course.language}
                        </span>
                      </div>
                      <span className="text-2xl font-extrabold text-orange-500">
                        {course.percent}%
                      </span>
                    </div>
                    <div className="w-full bg-orange-100 rounded-full h-2 mb-2">
                      <div
                        className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${course.percent}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-400">
                      {course.completedCount} of {course.totalLessons} lessons completed
                    </p>
                    {course.percent === 100 && (
                      <div className="mt-3 bg-green-50 border border-green-100 rounded-xl px-4 py-2 text-green-600 text-xs font-semibold">
                        🎉 Course Completed!
                      </div>
                    )}
                    {course.percent === 100 && (
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/certificate/${course.id}`) }}
                        className="mt-2 bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-semibold px-4 py-1.5 rounded-xl transition-all">
                        🎓 View Certificate
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}