const express = require('express')
const router = express.Router()
const supabase = require('../supabase')

// GET progress for a user
router.get('/:userId', async (req, res) => {
  const { data, error } = await supabase
    .from('progress')
    .select('*')
    .eq('user_id', req.params.userId)

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// POST mark lesson as complete
router.post('/complete', async (req, res) => {
  const { user_id, lesson_id } = req.body

  if (!user_id || !lesson_id) {
    return res.status(400).json({ error: 'user_id and lesson_id are required' })
  }

  // First check if already exists
  const { data: existing } = await supabase
    .from('progress')
    .select('*')
    .eq('user_id', user_id)
    .eq('lesson_id', lesson_id)
    .single()

  if (existing) {
    return res.json({ message: 'Already completed!', data: existing })
  }

  // Insert new progress
  const { data, error } = await supabase
    .from('progress')
    .insert({
      user_id,
      lesson_id,
      completed: true,
      completed_at: new Date().toISOString()
    })
    .select()

  if (error) return res.status(500).json({ error: error.message })
  res.json({ message: 'Lesson marked complete!', data })
})

module.exports = router