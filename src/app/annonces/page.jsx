export const revalidate = 60

import Link from 'next/link'
import {
  getAnnoncesFiltered,
  getDonneesReferenceCached,
  getQuartiersByVille,
} from '../../features/annonces/annoncesService'
import { createClient } from '../../lib/supabase/server'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import PropertyGrid from '../../features/annonces/PropertyGrid'
import FiltresSidebarDesktop from '../../components/filtres/FiltresSidebarDesktop'
import FiltresDrawerMobile from '../../components/filtres/FiltresDrawerMobile'
import ChipsFiltresActifs from '../../components/filtres/ChipsFiltresActifs'
import Pagination from '../../components/Pagination'

function first(v) {
  if (v === undefined || v === null) return undefined
  return Array.isArray(v) ? v[0] : v
}

async function favoriAnnonceIdsForViewer() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []
  const { data } = await supabase
    .from('favoris')
    .select('annonce_id')
    .eq('user_id', user.id)
  return (data ?? []).map((r) => r.annonce_id)
}

export async function generateMetadata({ searchParams }) {
  const sp = await searchParams
  const { villes } = await getDonneesReferenceCached()
  const communeRaw = first(sp.commune)
  const communeNom = communeRaw
    ? villes.find((v) => v.id === String(communeRaw))?.nom
    : null
  const lieu = communeNom || "Cote d'Ivoire"

  return {
    title: `Annonces immobilieres a ${lieu}`,
    description: `Trouvez des biens a ${lieu} - appartements, villas, terrains.`,
    alternates: { canonical: 'https://nestymo.ci/annonces' },
  }
}

export default async function AnnoncesPage({ searchParams }) {
  const sp = await searchParams

  const communeRaw = first(sp.commune)
  const commune =
    communeRaw && String(communeRaw).trim() !== ''
      ? String(communeRaw)
      : null

  const quartierRaw = first(sp.quartier)
  const quartier =
    quartierRaw && String(quartierRaw).trim() !== ''
      ? String(quartierRaw)
      : null

  const txRaw = first(sp.transaction)
  const transaction = ['louer', 'vendre', 'bail'].includes(txRaw)
    ? txRaw
    : null

  const sortRaw = first(sp.sort)
  const sort = ['recent', 'prix_asc', 'prix_desc'].includes(sortRaw)
    ? sortRaw
    : 'recent'

  const prix_min =
    first(sp.prix_min) != null &&
    !isNaN(Number(first(sp.prix_min))) &&
    Number(first(sp.prix_min)) > 0
      ? Number(first(sp.prix_min))
      : null

  const prix_max =
    first(sp.prix_max) != null &&
    !isNaN(Number(first(sp.prix_max))) &&
    Number(first(sp.prix_max)) > 0
      ? Number(first(sp.prix_max))
      : null

  const type_bien_raw = first(sp.type_bien)
  const type_bien =
    type_bien_raw && String(type_bien_raw).trim() !== ''
      ? String(type_bien_raw)
      : null

  const chRaw = first(sp.chambres_min)
  const chNum =
    chRaw != null && !isNaN(Number(chRaw)) ? Number(chRaw) : null
  const chambres_min = [1, 2, 3, 4].includes(chNum) ? chNum : null

  const pageRaw = first(sp.page)
  const page =
    pageRaw != null && !isNaN(Number(pageRaw))
      ? Math.max(1, parseInt(String(pageRaw), 10))
      : 1

  const quartiersListe = commune ? await getQuartiersByVille(commune) : []
  const quartierValide =
    quartier && quartiersListe.some((q) => q.id === quartier) ? quartier : null

  const filtresActifs = {
    commune,
    quartier: quartierValide,
    transaction,
    prix_min,
    prix_max,
    type_bien,
    chambres_min,
    sort,
  }

  const aFiltresActifs = Object.entries(filtresActifs)
    .filter(([k]) => k !== 'sort')
    .some(([, v]) => v !== null && v !== undefined)

  const [{ annonces, total }, { villes, typesBiens }, favoriIds] = await Promise.all([
    getAnnoncesFiltered({
      commune,
      quartier: quartierValide,
      transaction,
      prix_min,
      prix_max,
      type_bien,
      chambres_min,
      sort,
      page,
    }),
    getDonneesReferenceCached(),
    favoriAnnonceIdsForViewer(),
  ])

  const quartiers = quartiersListe

  const totalPages = Math.max(1, Math.ceil(total / 12))

  const labelTransaction =
    transaction === 'louer'
      ? 'a louer'
      : transaction === 'vendre'
        ? 'a vendre'
        : transaction === 'bail'
          ? 'en bail'
          : ''

  const communeNom = commune
    ? villes.find((v) => v.id === commune)?.nom
    : null
  const labelCommune = communeNom ? ` a ${communeNom}` : ''

  const labelCompteur =
    total > 0
      ? `${total} bien${total > 1 ? 's' : ''}${labelTransaction ? ` ${labelTransaction}` : ''}${labelCommune}`
      : 'Aucun bien trouve'

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-surface">
        <div className="mx-auto max-w-7xl px-4 pb-2 pt-6 md:px-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-xl font-semibold text-dark md:text-2xl">
                Annonces immobilieres
              </h1>
              <p className="mt-1 text-sm text-gray">{labelCompteur}</p>
            </div>
            <FiltresDrawerMobile
              key={`f-${commune ?? ''}-${quartierValide ?? ''}-${transaction ?? ''}-${type_bien ?? ''}-${sort}-${page}-${prix_min ?? ''}-${prix_max ?? ''}-${chambres_min ?? ''}`}
              villes={villes}
              typesBiens={typesBiens}
              quartiers={quartiers}
              filtresActifs={filtresActifs}
            />
          </div>

          {aFiltresActifs ? (
            <ChipsFiltresActifs
              filtres={filtresActifs}
              villes={villes}
              typesBiens={typesBiens}
              quartiers={quartiers}
              searchParams={sp}
            />
          ) : null}
        </div>

        <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
          <div className="flex gap-8">
            <aside className="hidden w-64 shrink-0 md:block">
              <FiltresSidebarDesktop
                villes={villes}
                typesBiens={typesBiens}
                quartiers={quartiers}
                filtresActifs={filtresActifs}
              />
            </aside>

            <div className="min-w-0 flex-1">
              {annonces.length === 0 ? (
                <div className="py-16 text-center">
                  <p className="mb-2 font-medium text-dark">
                    Aucun bien ne correspond a votre recherche
                  </p>
                  <p className="mb-6 text-sm text-gray">
                    Modifiez ou reinitialisez vos filtres.
                  </p>
                  <Link
                    href="/annonces"
                    className="inline-block rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover"
                  >
                    Reinitialiser les filtres
                  </Link>
                </div>
              ) : (
                <>
                  <PropertyGrid annonces={annonces} favoriIds={favoriIds} />
                  {totalPages > 1 ? (
                    <Pagination
                      page={page}
                      totalPages={totalPages}
                      searchParams={sp}
                    />
                  ) : null}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

