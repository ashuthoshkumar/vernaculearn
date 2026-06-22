require('dotenv').config()
const supabase = require('./src/supabase')

async function test() {
  console.log('Testing progress insert...')

  const { data, error } = await supabase
    .from('progress')
    .insert({
      user_id: '00000000-0000-0000-0000-000000000001',
      lesson_id: '00000000-0000-0000-0000-000000000001',
      completed: true,
      completed_at: new Date().toISOString()
    })
    .select()

  console.log('Data:', data)
  console.log('Error:', error)
}

test()