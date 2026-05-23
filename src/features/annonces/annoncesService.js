// Service annonces - requetes Supabase liees aux annonces
import { cache } from 'react'
import { unstable_cache } from 'next/cache'
import { createAnonClient } from '../../lib/supabase/anon'
import { createClient } from '../../lib/supabase/server'

export { formatWhatsApp, lienWhatsApp } from './phoneWhatsApp'

/**
 * 8 annonces publiees les plus recentes (homepage).
 */
export async function getAnnoncesPubliees() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('annonces')
    .select(`
      id,
      titre,
      prix,
      transaction,
      surface,
      chambres,
      created_at,
      agences ( id, nom, logo, logo_url ),
      villes ( nom ),
      quartiers ( nom ),
      types_biens ( nom ),
      photos ( url, is_principale, ordre )
    `)
    .eq('statut', 'publie')
    .order('created_at', { ascending: false })
    .limit(8)
    .limit(1, { foreignTable: 'photos' })

  if (error) {
    console.error('[annoncesService] getAnnoncesPubliees:', error.message)
    return []
  }

  return data ?? []
}

export function formatPrix(prix) {
  if (!prix || prix === 0) return 'Prix sur demande'
  return new Intl.NumberFormat('fr-FR').format(prix) + ' FCFA'
}

export function truncate(text, max = 120) {
  if (!text) return ''
  if (text.length <= max) return text
  const trimmed = text.slice(0, max)
  return trimmed.slice(0, trimmed.lastIndexOf(' ')) + '...'
}

export function formatDatePublication(dateStr) {
  if (!dateStr) return null
  const days = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24)
  )
  if (days < 1) return "Publie aujourd'hui"
  if (days < 7) return `Publie il y a ${days} jour${days > 1 ? 's' : ''}`
  return `Publie le ${new Date(dateStr).toLocaleDateString('fr-FR')}`
}

/**
 * Annonce publiee par id UUID.
 */
export const getAnnonceById = cache(async function getAnnonceById(id) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('annonces')
    .select(`
      id,
      titre,
      prix,
      transaction,
      surface,
      chambres,
      salles_de_bain,
      description,
      adresse,
      latitude,
      longitude,
      equipements,
      created_at,
      agences (
        id,
        nom,
        logo,
        logo_url,
        whatsapp,
        telephone,
        email,
        show_phone,
        show_email,
        show_whatsapp,
        verification_status
      ),
      villes ( nom ),
      quartiers ( nom ),
      types_biens ( nom ),
      photos ( url, is_principale, ordre )
    `)
    .eq('id', id)
    .eq('statut', 'publie')
    .single()

  if (error || !data) {
    console.error('[annoncesService] getAnnonceById:', error?.message)
    return null
  }

  return data
})

/** @deprecated utiliser getAnnonceById */
export const getAnnonceBySlug = getAnnonceById

export async function getAnnoncesFiltered({
  commune = null,
  quartier = null,
  transaction = null,
  prix_min = null,
  prix_max = null,
  type_bien = null,
  chambres_min = null,
  sort = 'recent',
  page = 1,
} = {}) {
  const supabase = await createClient()
  const limit = 12
  const from = (page - 1) * limit
  const to = from + limit - 1

  let query = supabase
    .from('annonces')
    .select(
      `
      id,
      titre,
      prix,
      transaction,
      surface,
      chambres,
      created_at,
      agences ( id, nom, logo, logo_url ),
      villes ( nom ),
      quartiers ( nom ),
      types_biens ( nom ),
      photos ( url, is_principale, ordre )
    `,
      { count: 'exact' }
    )
    .eq('statut', 'publie')

  if (commune) query = query.eq('ville_id', commune)
  if (quartier) query = query.eq('quartier_id', quartier)
  if (transaction) query = query.eq('transaction', transaction)
  if (prix_min !== null) query = query.gte('prix', prix_min)
  if (prix_max !== null) query = query.lte('prix', prix_max)
  if (type_bien) query = query.eq('type_bien_id', type_bien)
  if (chambres_min !== null) query = query.gte('chambres', chambres_min)

  if (sort === 'prix_asc') query = query.order('prix', { ascending: true })
  else if (sort === 'prix_desc') query = query.order('prix', { ascending: false })
  else query = query.order('created_at', { ascending: false })

  query = query.range(from, to).limit(1, { foreignTable: 'photos' })

  const { data, error, count } = await query

  if (error) {
    console.error('[annoncesService] getAnnoncesFiltered:', error.message)
    return { annonces: [], total: 0, error: error.message }
  }

  return { annonces: data ?? [], total: count ?? 0, error: null }
}

export const getDonneesReferenceCached = unstable_cache(
  async function getDonneesReference() {
    const supabase = createAnonClient()
    if (!supabase) {
      return { villes: [], typesBiens: [] }
    }

    const [{ data: villes }, { data: typesBiens }] = await Promise.all([
      supabase.from('villes').select('id, nom').order('nom'),
      supabase.from('types_biens').select('id, nom').order('nom'),
    ])

    return {
      villes: villes ?? [],
      typesBiens: typesBiens ?? [],
    }
  },
  ['ref-villes-types'],
  { revalidate: 3600 }
)

export async function getQuartiersByVille(villeId) {
  if (!villeId) return []
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('quartiers')
    .select('id, nom')
    .eq('ville_id', villeId)
    .order('nom')

  if (error) {
    console.error('[annoncesService] getQuartiersByVille:', error.message)
    return []
  }
  return data ?? []
}

export async function getPublicStats() {
  const supabase = await createClient()

  const [pubRes, agRes, villesRows] = await Promise.all([
    supabase.from('annonces').select('*', { count: 'exact', head: true }).eq('statut', 'publie'),
    supabase
      .from('agences')
      .select('*', { count: 'exact', head: true })
      .eq('statut', 'active')
      .eq('verification_status', 'verified'),
    supabase.from('annonces').select('ville_id').eq('statut', 'publie'),
  ])

  const rows = villesRows.data ?? []
  const distinctVilles = new Set(rows.map((r) => r.ville_id).filter(Boolean))

  return {
    annoncesCount: pubRes.count ?? 0,
    agencesCount: agRes.count ?? 0,
    villesCount: distinctVilles.size,
  }
}

export async function getAnnoncesByAgence(agenceId, page = 1) {
  const supabase = await createClient()
  const limit = 12
  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, error, count } = await supabase
    .from('annonces')
    .select(
      `
      id,
      titre,
      prix,
      transaction,
      surface,
      chambres,
      created_at,
      agences ( id, nom, logo, logo_url ),
      villes ( nom ),
      quartiers ( nom ),
      types_biens ( nom ),
      photos ( url, is_principale, ordre )
    `,
      { count: 'exact' }
    )
    .eq('agence_id', agenceId)
    .eq('statut', 'publie')
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) {
    console.error('[annoncesService] getAnnoncesByAgence:', error.message)
    return { annonces: [], total: 0 }
  }

  return { annonces: data ?? [], total: count ?? 0 }
}
