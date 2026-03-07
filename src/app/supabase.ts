import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rqkzrsokdsdstjqocdbd.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxa3pyc29rZHNkc3RqcW9jZGJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3NzU2MjksImV4cCI6MjA4ODM1MTYyOX0.QlfbcM5CNANqI5wKOUxmwZGrG2NjGsPE0N4ZgygAOIA' 

export const supabase = createClient(supabaseUrl, supabaseKey)