require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

async function test() {
  const { data, error } = await supabase.from('courses').select('*')
  if (error) {
    console.log('❌ Error:', error.message)
  } else {
    console.log('✅ Connected! Data:', data)
  }
}

test()