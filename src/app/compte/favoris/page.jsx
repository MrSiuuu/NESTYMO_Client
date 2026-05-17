import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PropertyGrid from '@/features/annonces/PropertyGrid'

export const metadata = {
  title: 'Mes favoris',
}

export default async function CompteFavorisPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/connexion?redirect=/compte/favoris')

  const { data, error } = await supabase
    .from('favoris')
    .select(
      `
      annonce_id,
      annonces (
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
      )
    `
    )
    .eq('user_id', user.id)

  if (error) {
    console.error('[compte/favoris]', error.message)
  }

  const annonces = (data ?? [])
    .map((row) => row.annonces)
    .filter(Boolean)

  const favoriIds = annonces.map((a) => a.id)

  return (
    <div>
      <h1 className="text-xl font-bold text-dark md:text-2xl">Mes favoris</h1>
      <p className="mt-1 text-sm text-gray">Vos annonces sauvegardees</p>

      {annonces.length === 0 ? (
        <div className="mt-10 rounded-xl border border-border bg-white p-10 text-center shadow-sm">
          <p className="text-dark">Vous n&apos;avez pas encore de favoris. Explorez les annonces !</p>
          <Link
            href="/annonces"
            className="mt-6 inline-block cursor-pointer rounded-lg px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            style={{ backgroundColor: '#E02020' }}
          >
            Voir les annonces
          </Link>
        </div>
      ) : (
        <div className="mt-8">
          <PropertyGrid annonces={annonces} favoriIds={favoriIds} />
        </div>
      )}
    </div>
  )
}

