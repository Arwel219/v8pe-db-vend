  const { createClient } = supabase
  const _supabase = createClient('https://cynshbqlpgghjgwltukp.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5bnNoYnFscGdnaGpnd2x0dWtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2NTY4MjIsImV4cCI6MjA2MzIzMjgyMn0.uJ0VMtAoqawydknYNwdwQxGsvdSPW49Y36Seo9WNCQ8')

  console.log('Supabase Instance: ', _supabase)
