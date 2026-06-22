import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin() {
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      setError(error.message)
    } else {
      navigate('/courses')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 w-full max-w-md">

        {/* LOGO */}
        <div className="flex items-center gap-3 mb-8 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-9 h-9 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">V</div>
          <div>
            <p className="font-bold text-gray-900 text-sm leading-tight">VernacuLearn</p>
            <p className="text-gray-400 text-xs tracking-widest uppercase">Learn in your language</p>
          </div>
        </div>

        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Welcome back 👋</h1>
        <p className="text-gray-500 text-sm mb-8">Sign in to continue learning</p>

        {/* EMAIL */}
        <label className="text-xs font-semibold text-gray-600 uppercase tracking-widest">Email</label>
        <input
          type="email"
          placeholder="ravi@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mt-2 mb-5 px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-orange-400"
        />

        {/* PASSWORD */}
        <label className="text-xs font-semibold text-gray-600 uppercase tracking-widest">Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mt-2 mb-6 px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-orange-400"
        />

        {error && <p className="text-red-500 text-xs mb-4">{error}</p>}

        <button
          onClick={handleLogin}
          disabled={loading || !email || !password}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold py-3 rounded-xl text-sm"
        >
          {loading ? 'Signing in...' : 'Sign in →'}
        </button>

        <p className="text-center text-gray-400 text-xs mt-6">
          Don't have an account?{' '}
          <span onClick={() => navigate('/register')} className="text-orange-500 font-semibold cursor-pointer">
            Create account
          </span>
        </p>
      </div>
    </div>
  )
}