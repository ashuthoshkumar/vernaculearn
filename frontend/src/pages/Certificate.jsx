import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getCourses, getLessons, getProgress, getCertificate, generateCertificate } from '../services/api'
import Navbar from '../components/Navbar'

export default function Certificate() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const certificateRef = useRef(null)
  const [certificate, setCertificate] = useState(null)
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [eligible, setEligible] = useState(false)

  useEffect(() => {
    async function fetchData() {
      if (!user) return

      const allCourses = await getCourses()
      const currentCourse = allCourses.find(c => c.id === courseId)
      setCourse(currentCourse)

      const [lessons, progress] = await Promise.all([
        getLessons(courseId),
        getProgress(user.id)
      ])

      const completedInCourse = progress.filter(p =>
        lessons.some(l => l.id === p.lesson_id)
      ).length

      const isEligible = completedInCourse === lessons.length && lessons.length > 0
      setEligible(isEligible)

      if (isEligible) {
        const existingCert = await getCertificate(user.id, courseId)
        if (!existingCert.error) {
          setCertificate(existingCert)
        }
      }

      setLoading(false)
    }
    fetchData()
  }, [user, courseId])

  async function handleGenerate() {
    setGenerating(true)
    const studentName = user.user_metadata?.full_name || user.email
    const cert = await generateCertificate(user.id, courseId, studentName, course.title)
    setCertificate(cert)
    setGenerating(false)
  }

  async function handleDownload() {
    const element = certificateRef.current
    if (!element) return

    // Use html2canvas to capture certificate
    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'
    script.onload = async () => {
      const canvas = await window.html2canvas(element, {
        scale: 2,
        backgroundColor: '#ffffff'
      })
      const link = document.createElement('a')
      link.download = `VernacuLearn-Certificate-${course.title.replace(/ /g, '-')}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    }
    document.head.appendChild(script)
  }

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  function getCertificateId(id) {
    return 'VL-' + id.split('-')[0].toUpperCase()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-orange-50">
        <Navbar />
        <p className="text-center text-gray-400 mt-20">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-orange-50">
      <Navbar activePage="courses" />

      <div className="px-12 py-12 max-w-4xl mx-auto">

        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(`/courses/${courseId}`)}
          className="text-orange-500 text-sm font-semibold hover:underline mb-8 block">
          ← Back to Course
        </button>

        {!eligible ? (
          /* NOT ELIGIBLE */
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
            <p className="text-5xl mb-4">🔒</p>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Certificate Locked</h2>
            <p className="text-gray-500 text-sm mb-6">
              Complete all lessons in <strong>{course?.title}</strong> to unlock your certificate!
            </p>
            <button
              onClick={() => navigate(`/courses/${courseId}`)}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-xl text-sm transition-all">
              Continue Learning →
            </button>
          </div>
        ) : !certificate ? (
          /* ELIGIBLE BUT NOT GENERATED */
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
            <p className="text-5xl mb-4">🎓</p>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Congratulations! You completed {course?.title}!
            </h2>
            <p className="text-gray-500 text-sm mb-8">
              You've earned a certificate of completion. Generate it now!
            </p>
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold px-10 py-3 rounded-xl text-sm shadow-lg shadow-orange-200 transition-all hover:-translate-y-0.5 disabled:opacity-50">
              {generating ? 'Generating...' : '🎓 Generate Certificate'}
            </button>
          </div>
        ) : (
          /* CERTIFICATE */
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Your Certificate 🎓</h2>
              <button
                onClick={handleDownload}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-all flex items-center gap-2">
                ⬇️ Download PNG
              </button>
            </div>

            {/* CERTIFICATE DESIGN */}
            <div
              ref={certificateRef}
              className="bg-white rounded-3xl shadow-2xl overflow-hidden"
              style={{ border: '3px solid #f97316' }}>

              {/* TOP BORDER DESIGN */}
              <div className="h-3 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600" />

              <div className="px-16 py-12 text-center">

                {/* LOGO */}
                <div className="flex items-center justify-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center text-white font-black text-xl">
                    V
                  </div>
                  <div className="text-left">
                    <p className="font-black text-gray-900 text-lg leading-tight">VernacuLearn</p>
                    <p className="text-gray-400 text-xs tracking-widest uppercase">Learn in your language</p>
                  </div>
                </div>

                {/* CERTIFICATE TITLE */}
                <p className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-3">
                  Certificate of Completion
                </p>
                <div className="w-24 h-0.5 bg-orange-200 mx-auto mb-8" />

                {/* THIS IS TO CERTIFY */}
                <p className="text-gray-400 text-sm mb-3">This is to certify that</p>

                {/* STUDENT NAME */}
                <h1 className="font-black text-gray-900 mb-3"
                  style={{ fontSize: '42px', fontFamily: 'Georgia, serif', letterSpacing: '-1px' }}>
                  {certificate.student_name}
                </h1>

                <p className="text-gray-400 text-sm mb-3">has successfully completed the course</p>

                {/* COURSE NAME */}
                <h2 className="text-2xl font-bold text-orange-500 mb-8">
                  {certificate.course_name}
                </h2>

                {/* STARS DECORATION */}
                <div className="flex items-center justify-center gap-2 mb-8">
                  <div className="h-px w-16 bg-orange-200" />
                  <span className="text-orange-300 text-lg">✦ ✦ ✦</span>
                  <div className="h-px w-16 bg-orange-200" />
                </div>

                {/* DETAILS ROW */}
                <div className="flex items-center justify-between mt-4">
                  <div className="text-left">
                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Issued On</p>
                    <p className="font-semibold text-gray-700 text-sm">{formatDate(certificate.issued_at)}</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-orange-50 rounded-full border-2 border-orange-200 flex items-center justify-center text-3xl">
                      🏆
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Certificate ID</p>
                    <p className="font-semibold text-gray-700 text-sm font-mono">{getCertificateId(certificate.id)}</p>
                  </div>
                </div>

                {/* SIGNATURE LINE */}
                <div className="mt-10 pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-center gap-2">
                    <p className="text-xs text-gray-400">Verified by</p>
                    <p className="text-xs font-bold text-orange-500">VernacuLearn Platform</p>
                    <span className="text-green-500 text-xs">✓</span>
                  </div>
                  <p className="text-xs text-gray-300 mt-1">vernaculearn-teal.vercel.app</p>
                </div>
              </div>

              {/* BOTTOM BORDER */}
              <div className="h-3 bg-gradient-to-r from-orange-600 via-orange-500 to-orange-400" />
            </div>

            {/* SHARE SECTION */}
            <div className="mt-6 bg-white rounded-2xl border border-gray-100 p-6 flex items-center justify-between">
              <div>
                <p className="font-bold text-gray-900 text-sm">Share your achievement! 🎉</p>
                <p className="text-gray-400 text-xs mt-1">Certificate ID: {getCertificateId(certificate.id)}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    const text = `I just completed "${certificate.course_name}" on VernacuLearn! 🎓 Learning tech in my language is amazing! Check it out: https://vernaculearn-teal.vercel.app`
                    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=https://vernaculearn-teal.vercel.app`, '_blank')
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all">
                  Share on LinkedIn
                </button>
                <button
                  onClick={() => {
                    const text = `I just completed "${certificate.course_name}" on VernacuLearn! 🎓 #VernacuLearn #Telugu #LearnInYourLanguage`
                    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank')
                  }}
                  className="bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all">
                  Share on X
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}