import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Only connect if a real URL is configured (not the placeholder)
const isConfigured =
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('your_supabase')

if (!isConfigured) {
  console.info(
    '[Supabase] Running in demo mode — add real credentials to .env.local to enable the live wish wall.'
  )
}

export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null
