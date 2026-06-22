require('dotenv').config()

async function testDoubt() {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: 'Python lo list ante emi? Telugu lo cheppandi.'
          }
        ]
      })
    })

    const data = await response.json()
    console.log('Response:', JSON.stringify(data, null, 2))

  } catch (error) {
    console.log('Error:', error.message)
  }
}

testDoubt()