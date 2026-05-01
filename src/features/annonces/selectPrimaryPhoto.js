/**
 * Sélectionne la photo principale d'une annonce.
 * Règle (dans l'ordre) :
 * 1. Photo avec is_principale = true (si plusieurs, prendre la première du tableau trié par ordre)
 * 2. Photo avec le plus petit ordre
 * 3. null si aucune photo (le composant affiche le placeholder)
 *
 * @param {Array} photos - tableau de photos de l'annonce
 * @returns {string|null} - url de la photo ou null
 */
export function selectPrimaryPhoto(photos) {
  if (!photos || photos.length === 0) return null

  // Trier par ordre croissant pour garantir un résultat déterministe
  const sorted = [...photos].sort((a, b) => (a.ordre ?? 0) - (b.ordre ?? 0))

  const principale = sorted.find((p) => p.is_principale === true)
  if (principale) return principale.url

  return sorted[0].url
}
