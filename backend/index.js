const express = require('express')
const cors = require('cors')
require('dotenv').config()

const courseRoutes = require('./src/routes/courses')
const lessonRoutes = require('./src/routes/lessons')
const progressRoutes = require('./src/routes/progress')
const doubtRoutes = require('./src/routes/doubt')
const gamificationRoutes = require('./src/routes/gamification')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/courses', courseRoutes)
app.use('/api/lessons', lessonRoutes)
app.use('/api/progress', progressRoutes)
app.use('/api/doubt', doubtRoutes)
app.use('/api/gamification', gamificationRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'VernacuLearn backend is live! 🚀' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})