// Service contacts — toute la logique leads est ici, jamais dans annoncesService
import { createClient } from '../../lib/supabase/client'

/** Email sentinelle : le formulaire MVP ne collecte pas l'email ; la table exige NOT NULL (voir Bdd.sql). */
const EMAIL_PLACEHOLDER_FICHE = 'non-renseigne@immoci.ci'

/**
 * Insère un contact (lead) dans la table contacts.
 * Appelé depuis FormulaireContact (Client Component).
 *
 * @param {Object} contact
 * @param {string} contact.annonce_id - UUID de l'annonce
 * @param {string|null} contact.agence_id - UUID de l'agence (obligatoire côté base)
 * @param {string} contact.nom - nom du visiteur
 * @param {string} contact.telephone - téléphone (obligatoire, min 8 chiffres côté UI)
 * @param {string} [contact.message] - message optionnel
 * @returns {Promise<{ success: boolean, error: string|null }>}
 */
export async function insertContact({
  annonce_id,
  agence_id,
  nom,
  telephone,
  message,
}) {
  if (!agence_id) {
    console.error('[contactsService] insertContact: agence_id requis')
    return { success: false, error: 'Agence introuvable' }
  }

  const supabase = createClient()

  // Colonne `source` absente du schéma actuel (Bdd.sql) — non incluse dans l'insert
  const { error } = await supabase.from('contacts').insert({
    annonce_id,
    agence_id,
    nom,
    email: EMAIL_PLACEHOLDER_FICHE,
    telephone: telephone || null,
    message: (message && message.trim()) || '',
  })

  if (error) {
    console.error('[contactsService] insertContact:', error.message)
    return { success: false, error: error.message }
  }

  return { success: true, error: null }
}
