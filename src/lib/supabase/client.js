// Client Supabase pour les Client Components uniquement
// Ne pas utiliser pour fetcher les annonces — réservé aux futures interactions navigateur
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}
