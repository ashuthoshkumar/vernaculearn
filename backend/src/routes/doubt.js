const express = require('express')
const router = express.Router()

router.post('/', async (req, res) => {
  const { question, language } = req.body

  if (!question) {
    return res.status(400).json({ error: 'Question is required' })
  }

  const languageMap = {
    telugu: 'Telugu',
    hindi: 'Hindi',
    tamil: 'Tamil',
    english: 'English'
  }

  const lang = languageMap[language] || 'English'

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `You are a helpful coding teacher. 
You MUST answer ONLY in ${lang} language.
If the language is Telugu, answer completely in Telugu script.
If the language is Hindi, answer completely in Hindi script.
If the language is Tamil, answer completely in Tamil script.
If the language is English, answer completely in English.
Never mix languages. Always use ${lang} only.
Keep answers simple and beginner friendly.`
          },
          {
            role: 'user',
            content: question
          }
        ]
      })
    })

    const data = await response.json()
    const answer = data.choices[0].message.content
    res.json({ answer, language: lang })

  } catch (error) {
    console.error('Groq error:', error)
    res.status(500).json({ error: 'Failed to get answer' })
  }
})

module.exports = router