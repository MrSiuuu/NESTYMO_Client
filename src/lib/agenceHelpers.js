export function getLogoUrl(agence) {
  return agence?.logo_url?.trim() || agence?.logo?.trim() || null
}

export function getInitiales(nom = '') {
  const parts = nom.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return nom.slice(0, 2).toUpperCase()
}
