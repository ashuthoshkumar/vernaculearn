const express = require('express')
const router = express.Router()
const supabase = require('../supabase')

// GET certificate for a user and course
router.get('/:userId/:courseId', async (req, res) => {
  const { userId, courseId } = req.params

  const { data, error } = await supabase
    .from('certificates')
    .select('*')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .single()

  if (error) return res.status(404).json({ error: 'Certificate not found' })
  res.json(data)
})

// POST generate certificate
router.post('/generate', async (req, res) => {
  const { user_id, course_id, student_name, course_name } = req.body

  if (!user_id || !course_id || !student_name || !course_name) {
    return res.status(400).json({ error: 'All fields are required' })
  }

  const { data, error } = await supabase
    .from('certificates')
    .upsert({
      user_id,
      course_id,
      student_name,
      course_name,
      issued_at: new Date().toISOString()
    }, { onConflict: 'user_id,course_id' })
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

module.exports = router