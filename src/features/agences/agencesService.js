// Service agences - logique publique liee aux agences
import { cache } from 'react'
import { createClient } from '../../lib/supabase/server'
import { formatWhatsApp } from '../annonces/phoneWhatsApp'
import { getLogoUrl } from '@/lib/agenceHelpers'

/**
 * Agence visible uniquement si active + verified.
 */
export const getAgenceById = cache(async function getAgenceById(id) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('agences')
    .select(
      `id, nom, logo, logo_url, description, whatsapp, telephone, email, adresse,
      ville, villes ( nom ),
      statut, verification_status, created_at,
      show_phone, show_email, show_whatsapp, site_web, numero_agrement_mclu`
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

export function lienWhatsAppAgencePublique(nomAgence, numeroWhatsApp) {
  const tel = formatWhatsApp(numeroWhatsApp)
  if (!tel) return null
  const message = encodeURIComponent(
    `Bonjour ${nomAgence}, je souhaite avoir plus d'informations sur vos biens disponibles.`
  )
  return `https://wa.me/${tel.replace('+', '')}?text=${message}`
}

/** Domaine affiche sans protocole */
export function formatSiteWebDisplay(url) {
  if (!url?.trim()) return ''
  return url
    .trim()
    .replace(/^https?:\/\//i, '')
    .replace(/\/$/, '')
}

function villeAgence(agence) {
  if (agence.villes?.nom) return agence.villes.nom
  if (agence.ville?.trim()) return agence.ville.trim()
  return null
}

function logoAgence(agence) {
  return getLogoUrl(agence)
}

/**
 * Agences actives et verifiees pour l'annuaire public.
 */
export const getAgencesPubliques = cache(async function getAgencesPubliques() {
  const supabase = await createClient()

  const { data: agences, error } = await supabase
    .from('agences')
    .select(
      `
      id,
      nom,
      logo,
      logo_url,
      description,
      site_web,
      ville,
      verification_status,
      created_at,
      villes ( nom )
    `
    )
    .eq('statut', 'active')
    .eq('verification_status', 'verified')
    .order('nom', { ascending: true })

  if (error) {
    console.error('[agencesService] getAgencesPubliques:', error.message)
    return []
  }

  if (!agences?.length) return []

  const ids = agences.map((a) => a.id)
  const { data: annoncesRows } = await supabase
    .from('annonces')
    .select('agence_id')
    .eq('statut', 'publie')
    .in('agence_id', ids)

  const countByAgence = {}
  for (const row of annoncesRows ?? []) {
    countByAgence[row.agence_id] = (countByAgence[row.agence_id] ?? 0) + 1
  }

  return agences.map((a) => ({
    ...a,
    logoUrl: logoAgence(a),
    villeLabel: villeAgence(a),
    nbAnnonces: countByAgence[a.id] ?? 0,
  }))
})
