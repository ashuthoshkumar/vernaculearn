const express = require('express')
const router = express.Router()
const supabase = require('../supabase')

// GET all courses
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

// GET single course by id
router.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('id', req.params.id)
    .single()

  if (error) return res.status(404).json({ error: 'Course not found' })
  res.json(data)
})

module.exports = router