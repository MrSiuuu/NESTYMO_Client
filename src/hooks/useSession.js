'use client'

import { useSessionContext } from '@/contexts/SessionContext'

/**
 * Session visiteur Supabase (client).
 * @returns {{ session: import('@supabase/supabase-js').Session | null, user: import('@supabase/supabase-js').User | null, loading: boolean, refreshSession: () => Promise<void> }}
 */
export function useSession() {
  return useSessionContext()
}
