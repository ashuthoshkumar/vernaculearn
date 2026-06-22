const express = require('express')
const router = express.Router()
const supabase = require('../supabase')

// GET all lessons for a course
router.get('/:courseId', async (req, res) => {
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('course_id', req.params.courseId)
    .order('order_number', { ascending: true })

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

module.exports = router