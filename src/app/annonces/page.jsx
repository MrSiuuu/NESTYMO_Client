export const revalidate = 60

import {
  getAnnoncesFiltered,
  getDonneesReferenceCached,
} from '../../features/annonces/annoncesService'
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

export async function generateMetadata({ searchParams }) {
  const sp = await searchParams
  const { villes } = await getDonneesReferenceCached()
  const communeRaw = first(sp.commune)
  const communeNom = communeRaw
    ? villes.find((v) => v.id === String(communeRaw))?.nom
    : null
  const lieu = communeNom || 'Abidjan'

  return {
    title: `Annonces immobilières à ${lieu} | ImmoCI`,
    description: `Trouvez des biens immobiliers à ${lieu} — appartements, villas, terrains.`,
    alternates: { canonical: 'https://immoci.ci/annonces' },
  }
}

export default async function AnnoncesPage({ searchParams }) {
  const sp = await searchParams

  const communeRaw = first(sp.commune)
  const commune =
    communeRaw && String(communeRaw).trim() !== ''
      ? String(communeRaw)
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
    Number(first(sp.prix_min)) >= 0
      ? Number(first(sp.prix_min))
      : null

  const prix_max =
    first(sp.prix_max) != null &&
    !isNaN(Number(first(sp.prix_max))) &&
    Number(first(sp.prix_max)) >= 0
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

  const filtresActifs = {
    commune,
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

  const [{ annonces, total }, { villes, typesBiens }] = await Promise.all([
    getAnnoncesFiltered({
      commune,
      transaction,
      prix_min,
      prix_max,
      type_bien,
      chambres_min,
      sort,
      page,
    }),
    getDonneesReferenceCached(),
  ])

  const totalPages = Math.max(1, Math.ceil(total / 12))

  const labelTransaction =
    transaction === 'louer'
      ? 'à louer'
      : transaction === 'vendre'
        ? 'à vendre'
        : transaction === 'bail'
          ? 'en bail'
          : ''

  const communeNom = commune
    ? villes.find((v) => v.id === commune)?.nom
    : null
  const labelCommune = communeNom ? ` à ${communeNom}` : ''

  const labelCompteur =
    total > 0
      ? `${total} bien${total > 1 ? 's' : ''}${labelTransaction ? ` ${labelTransaction}` : ''}${labelCommune}`
      : 'Aucun bien trouvé'

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#FAF6EF]">
        <div className="mx-auto max-w-7xl px-4 pb-2 pt-6 md:px-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="min-w-0">
              <h1 className="font-playfair text-xl font-semibold text-[#0F1923] md:text-2xl">
                Annonces immobilières à Abidjan
              </h1>
              <p className="mt-1 text-sm text-[#6B7280]">{labelCompteur}</p>
            </div>
            <FiltresDrawerMobile
              villes={villes}
              typesBiens={typesBiens}
              filtresActifs={filtresActifs}
            />
          </div>

          {aFiltresActifs ? (
            <ChipsFiltresActifs
              filtres={filtresActifs}
              villes={villes}
              typesBiens={typesBiens}
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
                filtresActifs={filtresActifs}
              />
            </aside>

            <div className="min-w-0 flex-1">
              {annonces.length === 0 ? (
                <div className="py-16 text-center">
                  <p className="mb-2 font-medium text-[#0F1923]">
                    Aucun bien ne correspond à votre recherche
                  </p>
                  <p className="mb-6 text-sm text-[#6B7280]">
                    Essayez de modifier ou réinitialiser vos filtres.
                  </p>
                  <a
                    href="/annonces"
                    className="inline-block rounded-lg bg-[#D97B00] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#b86a00]"
                  >
                    Réinitialiser les filtres
                  </a>
                </div>
              ) : (
                <>
                  <PropertyGrid annonces={annonces} />
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
