'use client'

import { createClient } from '../../lib/supabase/client'

/**
 * Une vue par session et par annonce (sessionStorage).
 */
export async function recordVueOnce(annonceId) {
  if (typeof window === 'undefined' || !annonceId) return
  const key = `nestymo_vue_${annonceId}`
  if (sessionStorage.getItem(key)) return
  sessionStorage.setItem(key, '1')
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  const userId = session?.user?.id ?? null
  const { error } = await supabase
    .from('vues')
    .insert({ annonce_id: annonceId, user_id: userId })
  if (error) console.error('[clientTracking] vues:', error.message)
}

/**
 * Un clic WhatsApp ou telephone par session et par annonce.
 * @param {'whatsapp'|'telephone'} kind
 */
export async function recordClicOnce(annonceId, kind) {
  if (typeof window === 'undefined' || !annonceId) return
  const key = `nestymo_clic_${kind}_${annonceId}`
  if (sessionStorage.getItem(key)) return
  sessionStorage.setItem(key, '1')
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  const userId = session?.user?.id ?? null
  const { error } = await supabase
    .from('clics')
    .insert({ annonce_id: annonceId, user_id: userId })
  if (error) console.error('[clientTracking] clics:', error.message)
}
