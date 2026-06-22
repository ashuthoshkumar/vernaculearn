import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

export default function Navbar({ activePage }) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/')
  }

  function handleSearch(e) {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setSearchOpen(false)
    }
  }

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-12 py-4 bg-white/95 backdrop-blur border-b border-orange-100 shadow-sm">

      {/* LOGO */}
      <div onClick={() => navigate('/')} className="flex items-center gap-3 cursor-pointer flex-shrink-0">
        <div className="w-9 h-9 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center text-white font-black text-base">V</div>
        <div>
          <p className="font-bold text-gray-900 text-sm leading-tight">VernacuLearn</p>
          <p className="text-gray-400 text-xs tracking-widest uppercase">Learn in your language</p>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="flex-1 max-w-md mx-8">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-orange-400 bg-gray-50 focus:bg-white transition-all"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 text-xs">
              ✕
            </button>
          )}
        </form>
      </div>

      {/* NAV LINKS */}
      <div className="flex items-center gap-6">
        <span
          onClick={() => navigate('/')}
          className={`text-sm cursor-pointer ${activePage === 'home' ? 'text-orange-500 font-semibold' : 'text-gray-500 hover:text-orange-500'}`}>
          Home
        </span>
        <span
          onClick={() => navigate('/courses')}
          className={`text-sm cursor-pointer ${activePage === 'courses' ? 'text-orange-500 font-semibold' : 'text-gray-500 hover:text-orange-500'}`}>
          Courses
        </span>
        {user && (
          <span
            onClick={() => navigate('/profile')}
            className={`text-sm cursor-pointer ${activePage === 'profile' ? 'text-orange-500 font-semibold' : 'text-gray-500 hover:text-orange-500'}`}>
            My Profile
          </span>
        )}
      </div>

      {/* AUTH BUTTONS */}
      <div className="flex items-center gap-3 flex-shrink-0 ml-6">
        {user ? (
          <>
            <div
              onClick={() => navigate('/profile')}
              className="w-9 h-9 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white text-xs font-bold cursor-pointer">
              {user.email?.[0].toUpperCase()}
            </div>
            <button
              onClick={handleLogout}
              className="border border-gray-200 hover:border-red-200 hover:text-red-500 text-gray-500 text-sm font-medium px-4 py-2 rounded-xl transition-all">
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate('/login')}
              className="text-gray-500 text-sm font-medium hover:text-orange-500 px-4 py-2 rounded-xl hover:bg-orange-50 transition-all">
              Sign in
            </button>
            <button
              onClick={() => navigate('/register')}
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-all hover:-translate-y-0.5">
              Get started →
            </button>
          </>
        )}
      </div>
    </nav>
  )
}