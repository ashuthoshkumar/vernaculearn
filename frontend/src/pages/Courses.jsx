import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getCourses } from '../services/api'
import Navbar from '../components/Navbar'

export default function Courses() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const activeLang = searchParams.get('lang') || 'all'
  const searchQuery = searchParams.get('search') || ''

  useEffect(() => {
    async function fetchCourses() {
      const data = await getCourses()
      setCourses(data)
      setLoading(false)
    }
    fetchCourses()
  }, [])

  const languages = [
    { key: 'all', label: 'All Courses' },
    { key: 'telugu', label: 'తెలుగు' },
    { key: 'hindi', label: 'हिन्दी' },
    { key: 'tamil', label: 'தமிழ்' },
    { key: 'english', label: 'English' },
  ]

  // Filter by language and search
  const filtered = courses.filter(c => {
    const matchesLang = activeLang === 'all' || c.language === activeLang
    const matchesSearch = searchQuery === '' ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.language.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesLang && matchesSearch
  })

  return (
    <div className="min-h-screen bg-orange-50">
      <Navbar activePage="courses" />

      <div className="px-12 py-12">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-1">
              {searchQuery ? `Search: "${searchQuery}"` : 'All Courses'}
            </h1>
            <p className="text-gray-500 text-sm">
              {filtered.length} course{filtered.length !== 1 ? 's' : ''} found
            </p>
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchParams({})}
              className="text-sm text-orange-500 font-semibold hover:underline">
              ✕ Clear search
            </button>
          )}
        </div>

        {/* LANGUAGE FILTER TABS */}
        {!searchQuery && (
          <div className="flex items-center gap-3 mb-10">
            {languages.map((lang) => (
              <button
                key={lang.key}
                onClick={() => setSearchParams(lang.key === 'all' ? {} : { lang: lang.key })}
                className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
                  activeLang === lang.key
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-200'
                    : 'bg-white text-gray-500 border border-gray-100 hover:border-orange-200 hover:text-orange-500'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <p className="text-gray-400">Loading courses...</p>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-gray-700 font-bold text-lg mb-2">No courses found</p>
            <p className="text-gray-400 text-sm mb-6">
              {searchQuery
                ? `No results for "${searchQuery}". Try a different keyword.`
                : 'No courses available in this language yet.'}
            </p>
            <button
              onClick={() => setSearchParams({})}
              className="bg-orange-500 text-white px-6 py-2 rounded-xl text-sm font-semibold hover:bg-orange-600 transition-all">
              View All Courses
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((course) => (
              <div
                key={course.id}
                onClick={() => navigate(`/courses/${course.id}`)}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer"
              >
                <div className="w-full h-32 bg-orange-50 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                  {course.thumbnail_url ? (
                    <img
                      src={course.thumbnail_url}
                      alt={course.title}
                      className="w-full h-full object-contain p-4"
                    />
                  ) : (
                    <span className="text-4xl">📚</span>
                  )}
                </div>
                <span className="text-xs font-semibold uppercase tracking-widest text-orange-500 bg-orange-50 px-3 py-1 rounded-full">
                  {course.language}
                </span>
                <h2 className="text-base font-bold text-gray-900 mt-3 mb-2 line-clamp-2">{course.title}</h2>
                <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">{course.description}</p>
                <button className="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-xl text-sm transition-all">
                  Start Learning →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}