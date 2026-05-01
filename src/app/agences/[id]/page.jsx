import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  getAgenceById,
  lienWhatsAppAgencePublique,
} from '../../../features/agences/agencesService'
import { getAnnoncesByAgence } from '../../../features/annonces/annoncesService'
import Navbar from '../../../components/Navbar'
import Footer from '../../../components/Footer'
import PropertyGrid from '../../../features/annonces/PropertyGrid'
import Pagination from '../../../components/Pagination'

export const revalidate = 60

function first(v) {
  if (v === undefined || v === null) return undefined
  return Array.isArray(v) ? v[0] : v
}

function initialesAgence(nom) {
  if (!nom?.trim()) return '?'
  const parts = nom.trim().split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return nom.slice(0, 2).toUpperCase()
}

export async function generateMetadata({ params }) {
  const { id } = await params
  const agence = await getAgenceById(id)

  if (!agence) return { title: 'Agence introuvable — ImmoCI' }

  const { total } = await getAnnoncesByAgence(id, 1)

  return {
    title: `${agence.nom} — Agence immobilière à Abidjan | ImmoCI`,
    description: `Découvrez les annonces immobilières de ${agence.nom} sur ImmoCI.`,
    robots:
      total === 0
        ? { index: false, follow: false }
        : { index: true, follow: true },
    openGraph: {
      title: agence.nom,
      description: `Agence immobilière partenaire ImmoCI — ${agence.nom}`,
      images: agence.logo ? [{ url: agence.logo }] : [],
      locale: 'fr_CI',
      type: 'website',
    },
  }
}

export default async function PageAgence({ params, searchParams }) {
  const { id } = await params
  const sp = await searchParams

  const agence = await getAgenceById(id)
  if (!agence) notFound()

  const pageRaw = first(sp?.page)
  const page =
    pageRaw != null && !isNaN(Number(pageRaw))
      ? Math.max(1, parseInt(String(pageRaw), 10))
      : 1

  const { annonces, total } = await getAnnoncesByAgence(id, page)
  const totalPages = Math.max(1, Math.ceil(total / 12))

  const waUrl = lienWhatsAppAgencePublique(agence.nom, agence.whatsapp)
  const telPropre = agence.telephone?.replace(/\s/g, '') ?? ''

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#FAF6EF]">
        {/* Hero */}
        <section className="bg-[#1A1A2E] px-4 py-12 md:px-6 md:py-16">
          <div className="mx-auto max-w-5xl text-center">
            <div className="mb-6 flex justify-center">
              {agence.logo ? (
                <span className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-4 border-[#D97B00]">
                  <Image
                    src={agence.logo}
                    alt={agence.nom}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </span>
              ) : (
                <span
                  className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-[#D97B00] bg-[#D97B00] font-playfair text-2xl font-bold text-white"
                  aria-hidden
                >
                  {initialesAgence(agence.nom)}
                </span>
              )}
            </div>

            <p className="mb-4 inline-block rounded-full bg-[#1D9E75] px-4 py-1.5 text-sm font-medium text-white">
              Agence partenaire ImmoCI
            </p>

            <h1 className="font-playfair text-3xl font-bold text-white md:text-4xl">
              {agence.nom}
            </h1>

            {agence.adresse ? (
              <p className="mt-4 text-lg text-white/80">{agence.adresse}</p>
            ) : null}

            <p className="mt-4 text-white/90">
              {total > 0
                ? `${total} annonce${total > 1 ? 's' : ''} publiée${total > 1 ? 's' : ''}`
                : 'Aucune annonce pour le moment'}
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              {waUrl ? (
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full max-w-xs items-center justify-center rounded-lg bg-[#1D9E75] px-6 py-3 font-medium text-white transition hover:bg-[#188f68] sm:w-auto"
                >
                  Écrire sur WhatsApp
                </a>
              ) : telPropre ? (
                <a
                  href={`tel:${telPropre}`}
                  className="inline-flex w-full max-w-xs items-center justify-center rounded-lg bg-[#D97B00] px-6 py-3 font-medium text-white transition hover:bg-[#b86a00] sm:w-auto"
                >
                  Appeler
                </a>
              ) : (
                <p className="text-sm text-white/60">
                  Contact direct non disponible
                </p>
              )}
            </div>
          </div>
        </section>

        {agence.description ? (
          <section className="mx-auto max-w-3xl px-4 py-10 md:px-6">
            <div className="rounded-xl bg-white p-6 shadow-md md:p-8">
              <h2 className="font-playfair text-xl font-semibold text-[#0F1923] md:text-2xl">
                À propos de {agence.nom}
              </h2>
              <div className="mt-4 whitespace-pre-line text-[#0F1923] leading-relaxed">
                {agence.description}
              </div>
            </div>
          </section>
        ) : null}

        <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
          <h2 className="mb-8 font-playfair text-2xl font-semibold text-[#0F1923]">
            {total > 0
              ? `Annonces de ${agence.nom}`
              : `Aucune annonce de ${agence.nom} pour le moment`}
          </h2>

          {annonces.length === 0 ? (
            <div className="rounded-xl bg-white py-16 text-center shadow-md">
              <p className="mb-2 text-[#0F1923]">
                Cette agence n&apos;a pas encore d&apos;annonce publiée.
              </p>
              <p className="mb-6 text-sm text-[#6B7280]">
                Découvrez d&apos;autres biens sur ImmoCI.
              </p>
              <Link
                href="/annonces"
                className="inline-block rounded-lg bg-[#D97B00] px-6 py-3 font-medium text-white transition hover:bg-[#b86a00]"
              >
                Voir toutes les annonces
              </Link>
            </div>
          ) : (
            <>
              <PropertyGrid annonces={annonces} />
              {totalPages > 1 ? (
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  searchParams={sp}
                  variant="agence"
                  agenceId={id}
                />
              ) : null}
            </>
          )}
        </section>
      </main>

      <Footer />
    </>
  )
}
