const express = require('express')
const router = express.Router()
const supabase = require('../supabase')

// GET streak and badges for a user
router.get('/:userId', async (req, res) => {
  const { userId } = req.params

  const [streakResult, badgesResult] = await Promise.all([
    supabase.from('streaks').select('*').eq('user_id', userId).single(),
    supabase.from('badges').select('*').eq('user_id', userId).order('earned_at', { ascending: true })
  ])

  res.json({
    streak: streakResult.data || { current_streak: 0, longest_streak: 0 },
    badges: badgesResult.data || []
  })
})

// POST update streak when lesson completed
router.post('/streak/:userId', async (req, res) => {
  const { userId } = req.params
  const today = new Date().toISOString().split('T')[0]

  // Get existing streak
  const { data: existing } = await supabase
    .from('streaks')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (!existing) {
    // First time — create streak
    await supabase.from('streaks').insert({
      user_id: userId,
      current_streak: 1,
      longest_streak: 1,
      last_activity_date: today
    })
    return res.json({ current_streak: 1, longest_streak: 1 })
  }

  const lastDate = existing.last_activity_date
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split('T')[0]

  let newStreak = existing.current_streak

  if (lastDate === today) {
    // Already active today — no change
    return res.json({ current_streak: existing.current_streak, longest_streak: existing.longest_streak })
  } else if (lastDate === yesterdayStr) {
    // Consecutive day — increment streak
    newStreak = existing.current_streak + 1
  } else {
    // Streak broken — reset to 1
    newStreak = 1
  }

  const newLongest = Math.max(newStreak, existing.longest_streak)

  await supabase.from('streaks').update({
    current_streak: newStreak,
    longest_streak: newLongest,
    last_activity_date: today,
    updated_at: new Date().toISOString()
  }).eq('user_id', userId)

  res.json({ current_streak: newStreak, longest_streak: newLongest })
})

// POST award badge
router.post('/badge/:userId', async (req, res) => {
  const { userId } = req.params
  const { badge_key, badge_name, badge_icon } = req.body

  const { data, error } = await supabase
    .from('badges')
    .upsert({
      user_id: userId,
      badge_key,
      badge_name,
      badge_icon,
      earned_at: new Date().toISOString()
    }, { onConflict: 'user_id,badge_key' })
    .select()

  if (error) return res.status(500).json({ error: error.message })
  res.json({ message: 'Badge awarded!', data })
})

module.exports = router