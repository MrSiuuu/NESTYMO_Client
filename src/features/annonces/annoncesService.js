// Service annonces — toutes les requêtes Supabase liées aux annonces sont ici
import { cache } from 'react'
import { createClient } from '../../lib/supabase/server'

/**
 * Récupère les 8 annonces publiées les plus récentes pour la homepage.
 * Jointures : agence, ville, quartier, type de bien, photos.
 * @returns {Promise<Array>} - tableau d'annonces ou tableau vide si erreur
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
      agences ( id, nom, logo ),
      villes ( nom ),
      quartiers ( nom ),
      types_biens ( nom ),
      photos ( url, is_principale, ordre )
    `)
    .eq('statut', 'publie')
    .order('created_at', { ascending: false })
    .limit(8)

  if (error) {
    // Logguer l'erreur mais ne pas crasher la page
    console.error('[annoncesService] getAnnoncesPubliees:', error.message)
    return []
  }

  return data ?? []
}

// --- Utilitaires partagés (fiche annonce, metadata) — pas de duplication ailleurs

export function formatPrix(prix) {
  if (!prix || prix === 0) return 'Prix sur demande'
  return new Intl.NumberFormat('fr-FR').format(prix) + ' FCFA'
}

/**
 * Formate un numéro de téléphone ivoirien pour wa.me
 * Gère : +225XXXXXXXX, 225XXXXXXXX, 00225XXXXXXXX, 0XXXXXXXX, XXXXXXXXX
 */
export function formatWhatsApp(numero) {
  if (!numero) return null
  const clean = numero.replace(/[^\d+]/g, '')
  if (clean.startsWith('+225')) return clean
  if (clean.startsWith('00')) return '+' + clean.slice(2)
  if (clean.startsWith('225')) return '+' + clean
  if (clean.startsWith('0')) return '+225' + clean.slice(1)
  return '+225' + clean
}

/**
 * Génère le lien WhatsApp avec message pré-rempli
 */
export function lienWhatsApp(numero, titre) {
  const tel = formatWhatsApp(numero)
  if (!tel) return null
  const message = encodeURIComponent(
    `Bonjour, je suis intéressé(e) par votre bien : ${titre}. Est-il toujours disponible ?`
  )
  return `https://wa.me/${tel.replace('+', '')}?text=${message}`
}

/**
 * Coupe proprement un texte sans couper un mot en plein milieu
 */
export function truncate(text, max = 120) {
  if (!text) return ''
  if (text.length <= max) return text
  const trimmed = text.slice(0, max)
  return trimmed.slice(0, trimmed.lastIndexOf(' ')) + '...'
}

/**
 * Affiche "Publié aujourd'hui", "Publié il y a X jours", ou la date
 */
export function formatDatePublication(dateStr) {
  if (!dateStr) return null
  const days = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24)
  )
  if (days < 1) return "Publié aujourd'hui"
  if (days < 7) return `Publié il y a ${days} jour${days > 1 ? 's' : ''}`
  return `Publié le ${new Date(dateStr).toLocaleDateString('fr-FR')}`
}

/**
 * Récupère une annonce publiée par son id (slug = id pour le MVP).
 * Wrappé dans React cache() pour éviter le double appel DB entre
 * generateMetadata() et page().
 *
 * @param {string} slug - l'id UUID de l'annonce (params.slug de la route)
 * @returns {Promise<Object|null>} - l'annonce ou null si non trouvée / non publiée
 */
export const getAnnonceBySlug = cache(async function getAnnonceBySlug(slug) {
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
      agences ( id, nom, logo, whatsapp, telephone ),
      villes ( nom ),
      quartiers ( nom ),
      types_biens ( nom ),
      photos ( url, is_principale, ordre )
    `)
    .eq('id', slug)
    .eq('statut', 'publie')
    .single()

  if (error || !data) {
    console.error('[annoncesService] getAnnonceBySlug:', error?.message)
    return null
  }

  return data
})

/**
 * Récupère les annonces publiées avec filtres, tri et pagination.
 * @returns {Promise<{ annonces: Array, total: number, error: string|null }>}
 */
export async function getAnnoncesFiltered({
  commune = null,
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
      agences ( id, nom, logo ),
      villes ( nom ),
      quartiers ( nom ),
      types_biens ( nom ),
      photos ( url, is_principale, ordre )
    `,
      { count: 'exact' }
    )
    .eq('statut', 'publie')

  if (commune) query = query.eq('ville_id', commune)
  if (transaction) query = query.eq('transaction', transaction)
  if (prix_min !== null) query = query.gte('prix', prix_min)
  if (prix_max !== null) query = query.lte('prix', prix_max)
  if (type_bien) query = query.eq('type_bien_id', type_bien)
  if (chambres_min !== null) query = query.gte('chambres', chambres_min)

  if (sort === 'prix_asc') query = query.order('prix', { ascending: true })
  else if (sort === 'prix_desc') query = query.order('prix', { ascending: false })
  else query = query.order('created_at', { ascending: false })

  query = query.range(from, to)

  const { data, error, count } = await query

  if (error) {
    console.error('[annoncesService] getAnnoncesFiltered:', error.message)
    return { annonces: [], total: 0, error: error.message }
  }

  return { annonces: data ?? [], total: count ?? 0, error: null }
}

/**
 * Villes + types de biens pour les filtres (une requête par cycle de rendu serveur).
 */
export const getDonneesReferenceCached = cache(async function getDonneesReference() {
  const supabase = await createClient()

  const [{ data: villes }, { data: typesBiens }] = await Promise.all([
    supabase.from('villes').select('id, nom').order('nom'),
    supabase.from('types_biens').select('id, nom').order('nom'),
  ])

  return {
    villes: villes ?? [],
    typesBiens: typesBiens ?? [],
  }
})

/**
 * Annonces publiées d'une agence, paginées (12 par page), tri date décroissante.
 */
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
      agences ( id, nom, logo ),
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
