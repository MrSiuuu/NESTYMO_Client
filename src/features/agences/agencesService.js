// Service agences — logique publique liée aux agences
import { cache } from 'react'
import { createClient } from '../../lib/supabase/server'
import { formatWhatsApp } from '../annonces/annoncesService'

/**
 * Récupère une agence par son id.
 * Visible UNIQUEMENT si statut = 'active' AND verification_status = 'verified'
 */
export const getAgenceById = cache(async function getAgenceById(id) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('agences')
    .select(
      'id, nom, logo, description, whatsapp, telephone, email, adresse, statut, verification_status, created_at'
    )
    .eq('id', id)
    .eq('statut', 'active')
    .eq('verification_status', 'verified')
    .single()

  if (error || !data) {
    console.error('[agencesService] getAgenceById:', error?.message)
    return null
  }

  return data
})

/**
 * Lien WhatsApp vers l'agence — message conforme au CDC Mission 5
 */
export function lienWhatsAppAgencePublique(nomAgence, numeroWhatsApp) {
  const tel = formatWhatsApp(numeroWhatsApp)
  if (!tel) return null
  const message = encodeURIComponent(
    `Bonjour ${nomAgence}, je souhaite avoir plus d'informations sur vos biens disponibles.`
  )
  return `https://wa.me/${tel.replace('+', '')}?text=${message}`
}
