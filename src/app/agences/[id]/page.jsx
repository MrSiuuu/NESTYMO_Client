import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { MessageCircle, Phone, Mail, Globe, MapPin } from 'lucide-react'
import AgenceAvatar from '@/components/AgenceAvatar'
import BadgeVerifie from '@/components/BadgeVerifie'
import { getLogoUrl } from '@/lib/agenceHelpers'
import {
  getAgenceById,
  lienWhatsAppAgencePublique,
  formatSiteWebDisplay,
} from '../../../features/agences/agencesService'
import { getAnnoncesByAgence } from '../../../features/annonces/annoncesService'
import Navbar from '../../../components/Navbar'
import Footer from '../../../components/Footer'
import AgenceAnnoncesSection from '../../../features/agences/AgenceAnnoncesSection'

export const revalidate = 60

function first(v) {
  if (v === undefined || v === null) return undefined
  return Array.isArray(v) ? v[0] : v
}

function membreDepuis(createdAt) {
  if (!createdAt) return null
  const d = new Date(createdAt)
  const mois = d.toLocaleString('fr-FR', { month: 'long' })
  const annee = d.getFullYear()
  return `${mois.charAt(0).toUpperCase()}${mois.slice(1)} ${annee}`
}

function villeAgence(agence) {
  if (agence.villes?.nom) return agence.villes.nom
  if (agence.ville?.trim()) return agence.ville.trim()
  return null
}

export async function generateMetadata({ params }) {
  const { id } = await params
  const agence = await getAgenceById(id)

  if (!agence) return { title: 'Agence introuvable' }

  const { total } = await getAnnoncesByAgence(id, 1)

  return {
    title: `${agence.nom} - Agence immobiliere`,
    description: `Annonces immobilieres de ${agence.nom} sur Nestymo.`,
    robots:
      total === 0
        ? { index: false, follow: false }
        : { index: true, follow: true },
    openGraph: {
      title: agence.nom,
      description: `Agence partenaire Nestymo - ${agence.nom}`,
      images: getLogoUrl(agence) ? [{ url: getLogoUrl(agence) }] : [],
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

  const ville = villeAgence(agence)
  const membre = membreDepuis(agence.created_at)
  const verified = agence.verification_status === 'verified'

  const waUrl =
    agence.show_whatsapp !== false
      ? lienWhatsAppAgencePublique(agence.nom, agence.whatsapp)
      : null
  const telPropre =
    agence.show_phone !== false && agence.telephone
      ? agence.telephone.replace(/\s/g, '')
      : ''
  const email =
    agence.show_email !== false && agence.email ? agence.email : null
  const siteDisplay = agence.site_web?.trim()
    ? formatSiteWebDisplay(agence.site_web)
    : null
  const siteHref = agence.site_web?.trim()
    ? agence.site_web.trim().startsWith('http')
      ? agence.site_web.trim()
      : `https://${agence.site_web.trim()}`
    : null

  const descCourte = agence.description?.trim()
    ? agence.description.trim().slice(0, 280) +
      (agence.description.length > 280 ? '…' : '')
    : null

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-white pb-12">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <nav
            aria-label="Fil d'Ariane"
            className="flex flex-wrap items-center gap-1 py-4 text-sm text-gray-500"
          >
            <Link href="/" className="hover:text-dark">
              Accueil
            </Link>
            <span className="text-gray-300">/</span>
            <Link href="/agences" className="hover:text-dark">
              Agences
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-700">{agence.nom}</span>
          </nav>

          <section className="grid grid-cols-1 items-start gap-10 border-b border-gray-100 py-10 md:grid-cols-[1fr_380px] md:gap-12 md:py-12">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-5">
                <AgenceAvatar agence={agence} size={88} />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-3xl font-bold tracking-tight text-dark md:text-4xl">
                      {agence.nom}
                    </h1>
                    {verified ? <BadgeVerifie size={20} /> : null}
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-500">
                    {ville ? (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
                        {ville}
                      </span>
                    ) : null}
                    {ville && membre ? (
                      <span className="h-1 w-1 rounded-full bg-gray-300" aria-hidden />
                    ) : null}
                    {membre ? <span>Membre depuis {membre}</span> : null}
                  </div>
                </div>
              </div>

              {descCourte ? (
                <p className="max-w-xl text-base leading-relaxed text-gray-700">
                  {descCourte}
                </p>
              ) : null}

              <div className="no-scrollbar -mx-4 flex gap-2.5 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:overflow-visible md:px-0">
                {waUrl ? (
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-xl bg-[#1FA866] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#178A53]"
                  >
                    <MessageCircle className="h-4 w-4" aria-hidden />
                    WhatsApp
                  </a>
                ) : null}
                {telPropre ? (
                  <a
                    href={`tel:${telPropre}`}
                    className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
                  >
                    <Phone className="h-4 w-4" aria-hidden />
                    Appeler
                  </a>
                ) : null}
                {email ? (
                  <a
                    href={`mailto:${email}`}
                    className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-dark transition hover:border-gray-300"
                  >
                    <Mail className="h-4 w-4" aria-hidden />
                    Email
                  </a>
                ) : null}
                {siteHref && siteDisplay ? (
                  <a
                    href={siteHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-dark transition hover:border-gray-300"
                  >
                    <Globe className="h-4 w-4" aria-hidden />
                    {siteDisplay}
                  </a>
                ) : null}
              </div>

              <div className="grid grid-cols-1 divide-y border-y border-gray-100 py-6 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                <div className="flex flex-col gap-1 py-4 sm:py-0 sm:pr-6">
                  <span className="text-2xl font-bold tracking-tight text-dark md:text-3xl">
                    {total}
                  </span>
                  <span className="text-xs text-gray-500">Annonces actives</span>
                </div>
                {verified ? (
                  <div className="flex flex-col gap-1 px-0 py-4 sm:px-6 sm:py-0">
                    <span className="text-2xl font-bold tracking-tight text-[#137C3B] md:text-3xl">
                      MCLU
                    </span>
                    <span className="text-xs text-gray-500">Agrement verifie</span>
                  </div>
                ) : null}
                {membre ? (
                  <div className="flex flex-col gap-1 py-4 sm:pl-6 sm:py-0">
                    <span className="text-2xl font-bold tracking-tight text-dark md:text-3xl">
                      {new Date(agence.created_at).getFullYear()}
                    </span>
                    <span className="text-xs text-gray-500">Annee d&apos;inscription</span>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="relative hidden aspect-[5/6] overflow-hidden rounded-[20px] bg-gray-100 md:block">
              {getLogoUrl(agence) ? (
                <Image
                  src={getLogoUrl(agence)}
                  alt={agence.nom}
                  fill
                  className="object-cover"
                  sizes="380px"
                />
              ) : (
                <div className="flex h-full items-center justify-center p-8">
                  <AgenceAvatar agence={agence} size={160} />
                </div>
              )}
            </div>
          </section>

          {(agence.description || agence.numero_agrement_mclu || agence.adresse) && (
            <section className="border-b border-gray-100 py-10">
              <h2 className="text-2xl font-semibold tracking-tight text-dark">
                A propos
              </h2>
              <div className="mt-6 grid grid-cols-1 gap-12 md:grid-cols-[1.4fr_1fr] md:gap-16">
                {agence.description ? (
                  <p className="whitespace-pre-line text-[15.5px] leading-[1.75] text-gray-700">
                    {agence.description}
                  </p>
                ) : (
                  <p className="text-gray-500">Aucune description disponible.</p>
                )}
                <div className="flex flex-col divide-y divide-gray-100">
                  {agence.adresse ? (
                    <div className="flex gap-4 py-3.5 text-sm">
                      <span className="w-28 shrink-0 text-gray-500">Adresse</span>
                      <span className="font-medium text-dark">{agence.adresse}</span>
                    </div>
                  ) : null}
                  {telPropre ? (
                    <div className="flex gap-4 py-3.5 text-sm">
                      <span className="w-28 shrink-0 text-gray-500">Telephone</span>
                      <a href={`tel:${telPropre}`} className="font-medium text-dark">
                        {agence.telephone}
                      </a>
                    </div>
                  ) : null}
                  {agence.numero_agrement_mclu ? (
                    <div className="flex gap-4 py-3.5 text-sm">
                      <span className="w-28 shrink-0 text-gray-500">Agrement</span>
                      <span className="font-medium text-dark">
                        {agence.numero_agrement_mclu}
                      </span>
                    </div>
                  ) : null}
                </div>
              </div>
            </section>
          )}

          {annonces.length === 0 ? (
            <section className="py-16 text-center">
              <p className="text-dark">Aucune annonce pour le moment.</p>
              <Link
                href="/annonces"
                className="mt-6 inline-block rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white"
              >
                Voir toutes les annonces
              </Link>
            </section>
          ) : (
            <AgenceAnnoncesSection
              annonces={annonces}
              agenceNom={agence.nom}
              page={page}
              totalPages={totalPages}
              searchParams={sp}
              agenceId={id}
            />
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}
