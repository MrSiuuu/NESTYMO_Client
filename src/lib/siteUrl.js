const DEFAULT_SITE_ORIGIN = 'https://nestymo.ci'

/** Origine publique du site (sans slash final). */
export function getSiteOrigin(headersList) {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (fromEnv) return fromEnv.replace(/\/$/, '')

  if (headersList) {
    const host =
      headersList.get('x-forwarded-host') ?? headersList.get('host')
    if (host) {
      const proto =
        headersList.get('x-forwarded-proto')?.split(',')[0]?.trim() ?? 'https'
      return `${proto}://${host}`
    }
  }

  return DEFAULT_SITE_ORIGIN
}

/** URL absolue d'une fiche annonce (partage WhatsApp, mailto, SEO). */
export function buildAnnoncePublicUrl(annonceId, headersList) {
  const origin = getSiteOrigin(headersList)
  return `${origin}/annonces/${annonceId}`
}
