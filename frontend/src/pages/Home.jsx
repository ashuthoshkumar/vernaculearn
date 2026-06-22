import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCourses } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    async function fetchCourses() {
      const data = await getCourses()
      setCourses(data)
      setLoading(false)
    }
    fetchCourses()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/')
  }

const languages = [
  { name: 'తెలుగు', label: 'Telugu Courses', lang: 'telugu' },
  { name: 'हिन्दी', label: 'Hindi Courses', lang: 'hindi' },
  { name: 'தமிழ்', label: 'Tamil Courses', lang: 'tamil' },
  { name: 'English', label: 'English Courses', lang: 'english' },
]

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-14 py-4 bg-white/95 backdrop-blur border-b border-orange-50 shadow-sm">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-9 h-9 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center text-white font-black text-base">V</div>
          <div>
            <p className="font-bold text-gray-900 text-sm leading-tight">VernacuLearn</p>
            <p className="text-gray-400 text-xs tracking-widest uppercase">Learn in your language</p>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <span onClick={() => navigate('/')} className="text-orange-500 text-sm font-semibold cursor-pointer">Home</span>
          <span onClick={() => navigate('/courses')} className="text-gray-500 text-sm cursor-pointer hover:text-orange-500 transition-colors">Courses</span>
          {user && (
            <span onClick={() => navigate('/profile')} className="text-gray-500 text-sm cursor-pointer hover:text-orange-500 transition-colors">My Profile</span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div
                onClick={() => navigate('/profile')}
                className="w-9 h-9 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white text-xs font-bold cursor-pointer">
                {user.email?.[0].toUpperCase()}
              </div>
              <button
                onClick={() => navigate('/courses')}
                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all hover:-translate-y-0.5">
                My Courses
              </button>
              <button
                onClick={handleLogout}
                className="border border-gray-200 hover:border-red-200 hover:text-red-500 text-gray-500 text-sm font-medium px-4 py-2.5 rounded-xl transition-all">
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="text-gray-500 text-sm font-medium hover:text-orange-500 px-4 py-2.5 rounded-xl hover:bg-orange-50 transition-all">
                Sign in
              </button>
              <button
                onClick={() => navigate('/register')}
                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all hover:-translate-y-0.5">
                Get started free →
              </button>
            </>
          )}
        </div>
      </nav>

      {/* HERO */}
      <section
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #fff9f5 0%, #fff5ee 40%, #fef0e6 100%)' }}>

        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none opacity-30"
          style={{ background: 'radial-gradient(circle, #fdba74 0%, transparent 65%)', transform: 'translate(20%, -30%)' }} />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full pointer-events-none opacity-10"
          style={{ background: 'radial-gradient(circle, #f97316 0%, transparent 70%)', transform: 'translate(-20%, 30%)' }} />

        <div className="flex items-center justify-between px-14 py-20 gap-12">

          {/* LEFT */}
          <div className="flex-1 z-10">
            <div className="inline-flex items-center gap-2 bg-white border border-orange-100 px-4 py-2 rounded-full text-xs text-gray-500 mb-8 shadow-sm">
              <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
              Made for Bharat &nbsp;·&nbsp; తెలుగు &nbsp;·&nbsp; हिन्दी &nbsp;·&nbsp; தமிழ்
            </div>

            <h1 className="font-black text-gray-900 mb-6 leading-none tracking-tight"
              style={{ fontSize: '54px', letterSpacing: '-1.5px' }}>
              Learn coding in<br/>the language{' '}
              <span className="text-orange-500">you think in.</span>
            </h1>

            <p className="text-gray-500 text-lg leading-relaxed mb-10" style={{ maxWidth: '480px' }}>
              Tech courses in Telugu, Hindi and Tamil. Watch lessons, ask doubts in your language, and earn certificates. Built for 2G networks and ₹6,000 phones.
            </p>

            <div className="flex items-center gap-4 mb-14">
              <button
                onClick={() => navigate('/courses')}
                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold px-8 py-4 rounded-2xl text-base shadow-lg shadow-orange-200 transition-all hover:-translate-y-1">
                Browse courses →
              </button>
              {!user && (
                <button
                  onClick={() => navigate('/register')}
                  className="bg-white text-gray-700 font-medium px-8 py-4 rounded-2xl text-base border border-gray-200 hover:border-orange-300 hover:text-orange-500 transition-all">
                  Get started free
                </button>
              )}
            </div>

            <div className="flex items-center gap-8">
              {[
                { num: loading ? '...' : `${courses.length}+`, label: 'Courses' },
                { num: '3', label: 'Languages' },
                { num: '4.8★', label: 'Avg rating' },
                { num: '100%', label: 'Free to start' },
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-8">
                  {i > 0 && <div className="w-px h-8 bg-orange-100" />}
                  <div>
                    <p className="text-2xl font-black text-gray-900">{stat.num}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* MIDDLE */}
          <div className="flex-1 z-10 flex flex-col gap-5">
            <p className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-2">Why VernacuLearn?</p>
            {[
              { icon: '🗣️', title: 'Learn in Telugu, Hindi or Tamil', desc: 'No more struggling with English. Every concept explained in your mother tongue.' },
              { icon: '🤖', title: 'AI Doubt Solver — 24/7', desc: 'Ask any coding doubt in your language. Get instant AI answers, anytime.' },
              { icon: '📱', title: 'Built for Bharat', desc: 'Works on ₹6,000 phones and 2G networks. No buffering, no barriers.' },
              { icon: '🎓', title: 'Earn certificates', desc: 'Get shareable certificates after completing courses. Show employers your skills.' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 bg-white/70 border border-orange-50 rounded-2xl p-5 hover:bg-white hover:border-orange-200 hover:shadow-md transition-all cursor-default">
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm mb-1">{item.title}</p>
                  <p className="text-gray-400 text-xs leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT */}
          <div className="flex flex-col gap-4 w-72 z-10 flex-shrink-0">
            <p className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-2">Browse by language</p>
            {loading ? (
              <p className="text-gray-300 text-sm">Loading...</p>
            ) : (
              languages.map((lang) => {
                const count = courses.filter(c => c.language === lang.lang).length
                return (
                  <div
                    key={lang.lang}
                    onClick={() => navigate(`/courses?lang=${lang.lang}`)}
                    className="group bg-white rounded-2xl px-6 py-5 flex items-center justify-between cursor-pointer transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
                    style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #f5f0eb' }}
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-400 to-orange-600 rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{lang.name}</p>
                      <p className="text-xs font-semibold tracking-widest text-gray-300 uppercase mt-1">{lang.label}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-4xl font-black text-orange-500">{count}</p>
                      <p className="text-xs text-gray-300 uppercase tracking-widest">course{count !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                )
              })
            )}

            {!user && (
              <div
                onClick={() => navigate('/register')}
                className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl px-6 py-5 cursor-pointer hover:-translate-y-1 transition-all"
                style={{ boxShadow: '0 8px 24px rgba(249,115,22,0.3)' }}>
                <p className="text-white font-bold text-base mb-1">Start learning today 🚀</p>
                <p className="text-orange-100 text-xs leading-relaxed">Free forever. No credit card needed.</p>
                <p className="text-white text-sm font-semibold mt-3">Create free account →</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* BOTTOM STRIP */}
      <section className="grid grid-cols-3 divide-x divide-orange-50 border-t border-orange-50">
        {[
          { icon: '⚡', title: 'Start in 2 minutes', desc: 'No setup needed. Sign up and start watching your first Telugu lesson immediately.' },
          { icon: '💬', title: 'Community support', desc: 'Join thousands of students learning together. Ask questions, share progress.' },
          { icon: '🏆', title: 'Job-ready skills', desc: 'Courses designed to get you hired. Real-world projects and industry-relevant content.' },
        ].map((f, i) => (
          <div key={i} className="px-12 py-10 hover:bg-orange-50 transition-colors group cursor-default">
            <div className="w-11 h-11 bg-orange-50 group-hover:bg-white rounded-2xl flex items-center justify-center text-xl mb-5 transition-colors">
              {f.icon}
            </div>
            <h3 className="text-sm font-bold text-gray-900 mb-2">{f.title}</h3>
            <p className="text-xs text-gray-400 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </section>

    </div>
  )
}