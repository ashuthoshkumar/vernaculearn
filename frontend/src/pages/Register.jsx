import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Register() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    full_name: '',
    date_of_birth: '',
    email: '',
    password: '',
    confirm_password: '',
    language: 'telugu'
  })

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function validateStep1() {
    if (!form.full_name.trim()) return 'Please enter your full name'
    if (!form.date_of_birth) return 'Please enter your date of birth'
    const age = new Date().getFullYear() - new Date(form.date_of_birth).getFullYear()
    if (age < 10) return 'You must be at least 10 years old'
    if (!form.language) return 'Please select your language'
    return null
  }

  function validateStep2() {
    if (!form.email.trim()) return 'Please enter your email'
    if (!form.password) return 'Please enter a password'
    if (form.password.length < 6) return 'Password must be at least 6 characters'
    if (form.password !== form.confirm_password) return 'Passwords do not match'
    return null
  }

  function handleNext() {
    const err = validateStep1()
    if (err) { setError(err); return }
    setError('')
    setStep(2)
  }

    async function handleRegister() {
  const err = validateStep2()
  if (err) { setError(err); return }
  setError('')
  setLoading(true)

  const { data, error: signUpError } = await supabase.auth.signUp({
    email: form.email,
    password: form.password,
    options: {
      data: {
        full_name: form.full_name,
        date_of_birth: form.date_of_birth,
        language: form.language
      }
    }   
  })

  if (signUpError) {
    setError(signUpError.message)
    setLoading(false)
    return
  }

  navigate('/courses')
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

        {/* STEP INDICATOR */}
        <div className="flex items-center gap-2 mb-8">
          <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? 'bg-orange-500' : 'bg-gray-200'}`} />
          <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? 'bg-orange-500' : 'bg-gray-200'}`} />
        </div>

        {step === 1 ? (
          <>
            <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Tell us about you 👋</h1>
            <p className="text-gray-500 text-sm mb-8">Step 1 of 2 — Basic details</p>

            {/* FULL NAME */}
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-widest">Full Name</label>
            <input
              type="text"
              name="full_name"
              placeholder="Ravi Kumar"
              value={form.full_name}
              onChange={handleChange}
              className="w-full mt-2 mb-5 px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-orange-400"
            />

            {/* DATE OF BIRTH */}
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-widest">Date of Birth</label>
            <input
              type="date"
              name="date_of_birth"
              value={form.date_of_birth}
              onChange={handleChange}
              className="w-full mt-2 mb-5 px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-orange-400"
            />

            {/* PREFERRED LANGUAGE */}
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-widest">Preferred Language</label>
            <select
              name="language"
              value={form.language}
              onChange={handleChange}
              className="w-full mt-2 mb-6 px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-orange-400 bg-white"
            >
              <option value="telugu">తెలుగు — Telugu</option>
<option value="hindi">हिन्दी — Hindi</option>
<option value="tamil">தமிழ் — Tamil</option>
<option value="english">English</option>
            </select>

            {error && <p className="text-red-500 text-xs mb-4">{error}</p>}

            <button
              onClick={handleNext}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl text-sm"
            >
              Next →
            </button>

            <p className="text-center text-gray-400 text-xs mt-6">
              Already have an account?{' '}
              <span onClick={() => navigate('/login')} className="text-orange-500 font-semibold cursor-pointer">
                Sign in
              </span>
            </p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Create your login 🔐</h1>
            <p className="text-gray-500 text-sm mb-8">Step 2 of 2 — Account credentials</p>

            {/* EMAIL */}
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-widest">Email</label>
            <input
              type="email"
              name="email"
              placeholder="ravi@example.com"
              value={form.email}
              onChange={handleChange}
              className="w-full mt-2 mb-5 px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-orange-400"
            />

            {/* PASSWORD */}
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-widest">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Min 6 characters"
              value={form.password}
              onChange={handleChange}
              className="w-full mt-2 mb-5 px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-orange-400"
            />

            {/* CONFIRM PASSWORD */}
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-widest">Confirm Password</label>
            <input
              type="password"
              name="confirm_password"
              placeholder="Re-enter password"
              value={form.confirm_password}
              onChange={handleChange}
              className="w-full mt-2 mb-6 px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-orange-400"
            />

            {error && <p className="text-red-500 text-xs mb-4">{error}</p>}

            <button
              onClick={handleRegister}
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold py-3 rounded-xl text-sm"
            >
              {loading ? 'Creating account...' : 'Create Account →'}
            </button>

            <button
              onClick={() => { setStep(1); setError('') }}
              className="w-full mt-3 text-gray-400 text-sm hover:text-orange-500"
            >
              ← Back
            </button>
          </>
        )}
      </div>
    </div>
  )
}