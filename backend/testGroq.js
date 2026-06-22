require('dotenv').config()

async function testGroq() {
  try {
    console.log('GROQ KEY:', process.env.GROQ_API_KEY ? 'Found ✅' : 'Missing ❌')

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
            role: 'user',
            content: 'Say hello in Telugu'
          }
        ]
      })
    })

    const data = await response.json()
    console.log('Full response:', JSON.stringify(data, null, 2))

  } catch (error) {
    console.log('Error:', error.message)
  }
}

testGroq()