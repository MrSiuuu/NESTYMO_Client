// Client Supabase anon sans cookies — donnees publiques (cache, build-time)
import { createClient } from '@supabase/supabase-js'

export function createAnonClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key)
}
