import { createClient } from '@/lib/supabase/server'

export default async function sitemap() {
  const base = 'https://nestymo.ci'
  const supabase = await createClient()

  const staticEntries = [
    { url: base, lastModified: new Date() },
    { url: `${base}/annonces`, lastModified: new Date() },
  ]

  const [{ data: annonces }, { data: agences }] = await Promise.all([
    supabase.from('annonces').select('id, updated_at').eq('statut', 'publie'),
    supabase
      .from('agences')
      .select('id, created_at')
      .eq('statut', 'active')
      .eq('verification_status', 'verified'),
  ])

  const annonceEntries = (annonces ?? []).map((a) => ({
    url: `${base}/annonces/${a.id}`,
    lastModified: a.updated_at ? new Date(a.updated_at) : new Date(),
  }))

  const agenceEntries = (agences ?? []).map((g) => ({
    url: `${base}/agences/${g.id}`,
    lastModified: g.created_at ? new Date(g.created_at) : new Date(),
  }))

  return [...staticEntries, ...annonceEntries, ...agenceEntries]
}
