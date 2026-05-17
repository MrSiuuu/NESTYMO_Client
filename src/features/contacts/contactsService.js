// Service contacts - leads (client Supabase)
import { createClient } from '../../lib/supabase/client'

export async function insertContact({
  annonce_id,
  agence_id,
  nom,
  email,
  telephone,
  message,
  source = 'formulaire',
  user_id = null,
}) {
  if (!agence_id) {
    console.error('[contactsService] insertContact: agence_id requis')
    return { success: false, error: 'Agence introuvable' }
  }

  const supabase = createClient()

  const payload = {
    annonce_id,
    agence_id,
    nom,
    email: email?.trim() || '',
    telephone: telephone || null,
    message: (message && message.trim()) || '',
  }

  if (user_id) payload.user_id = user_id

  let { error } = await supabase
    .from('contacts')
    .insert({ ...payload, source })

  if (
    error &&
    (error.message?.toLowerCase().includes('source') ||
      error.code === '42703' ||
      error.code === 'PGRST204')
  ) {
    const retry = await supabase.from('contacts').insert(payload)
    error = retry.error
  }

  if (error) {
    console.error('[contactsService] insertContact:', error.message)
    return { success: false, error: error.message }
  }

  return { success: true, error: null }
}
