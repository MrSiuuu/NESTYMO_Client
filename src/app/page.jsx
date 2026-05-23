export const revalidate = 60

import Image from 'next/image'
import Link from 'next/link'
import { ShieldCheck, BadgeCheck, Handshake } from 'lucide-react'
import {
  getAnnoncesPubliees,
  getDonneesReferenceCached,
  getPublicStats,
} from '../features/annonces/annoncesService'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PropertyGrid from '../features/annonces/PropertyGrid'
import PropertyCarouselLazy from '../features/annonces/PropertyCarouselLazy'

const PILLS_ORDER = [
  'Appartement',
  'Villa',
  'Studio',
  'Terrain',
  'Local commercial',
]

const POURQUOI = [
  {
    icon: ShieldCheck,
    title: 'Agences verifiees MCLU',
    text: "Chaque agence presente sur Nestymo dispose de son agrement MCLU, controle a l'inscription.",
  },
  {
    icon: BadgeCheck,
    title: 'Annonces certifiees',
    text: 'Titre foncier verifie, photos authentiques, prix conforme au marche. Les annonces non conformes sont retirees sous 24 h.',
  },
  {
    icon: Handshake,
    title: 'Contact direct garanti',
    text: "Vous parlez directement a l'agence mandataire. Pas de commission cachee, transparence a chaque etape.",
  },
]

export default async function HomePage() {
  const [annonces, { villes, typesBiens }, stats] = await Promise.all([
    getAnnoncesPubliees(),
    getDonneesReferenceCached(),
    getPublicStats(),
  ])

  const pills = PILLS_ORDER.map((nom) =>
    typesBiens.find((t) => t.nom === nom)
  ).filter(Boolean)

  return (
    <>
      <Navbar />

      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-12 md:grid-cols-2 md:gap-12 md:px-6 md:py-20">
          <div>
            <span className="hidden items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-700 md:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-[#E02020]" aria-hidden />
              Plateforme certifiee MCLU · 2026
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-dark md:text-5xl">
              Trouvez votre prochain{' '}
              <span className="text-[#E02020]">chez-vous</span>
              <br />
              a Abidjan.
            </h1>
            <p className="mt-4 max-w-lg text-base text-gray-600 md:text-lg">
              Des annonces verifiees, publiees par des agences agreees. Pas
              d&apos;intermediaire fantome — de l&apos;immobilier en confiance.
            </p>

            <form
              method="GET"
              action="/annonces"
              className="mt-8 flex flex-col gap-3 rounded-[20px] border border-gray-200 bg-white p-4 shadow-lg md:flex-row md:flex-wrap md:items-end"
            >
              <div className="min-w-0 flex-1 md:min-w-[140px]">
                <label className="mb-1 block text-xs font-medium text-gray-500">
                  Transaction
                </label>
                <select
                  name="transaction"
                  defaultValue=""
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-dark"
                >
                  <option value="">Tout</option>
                  <option value="vendre">Acheter</option>
                  <option value="louer">Louer</option>
                </select>
              </div>
              <div className="min-w-0 flex-1 md:min-w-[140px]">
                <label className="mb-1 block text-xs font-medium text-gray-500">
                  Type de bien
                </label>
                <select
                  name="type_bien"
                  defaultValue=""
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-dark"
                >
                  <option value="">Tous</option>
                  {typesBiens.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.nom}
                    </option>
                  ))}
                </select>
              </div>
              <div className="min-w-0 flex-1 md:min-w-[160px]">
                <label className="mb-1 block text-xs font-medium text-gray-500">
                  Ville
                </label>
                <select
                  name="commune"
                  defaultValue=""
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-dark"
                >
                  <option value="">Toutes</option>
                  {villes.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.nom}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="w-full shrink-0 cursor-pointer rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover md:w-auto"
              >
                Rechercher
              </button>
            </form>

            <div className="no-scrollbar -mx-4 mt-6 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:overflow-visible md:px-0">
              {pills.map((t) => (
                <Link
                  key={t.id}
                  href={`/annonces?type_bien=${t.id}`}
                  className="shrink-0 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-dark transition hover:border-gray-300"
                >
                  {t.nom}
                </Link>
              ))}
            </div>
          </div>

          <div className="relative hidden md:block">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
              <Image
                src="/images/Nestymo.webp"
                alt="Immobilier a Abidjan sur Nestymo"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 0px, 50vw"
              />
            </div>
            <div className="absolute -left-6 top-8 flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-lg">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-[#E02020]">
                <ShieldCheck className="h-5 w-5" aria-hidden />
              </div>
              <div>
                <p className="text-sm font-semibold text-dark">Agences verifiees</p>
                <p className="text-xs text-gray-500">Agrement MCLU</p>
              </div>
            </div>
            <div className="absolute -right-4 bottom-6 min-w-[200px] rounded-2xl border border-gray-100 bg-white p-4 shadow-lg">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">
                Cette semaine
              </p>
              <p className="mt-1 text-2xl font-bold tracking-tight text-dark">
                + {Math.min(stats.annoncesCount, 312)} annonces
              </p>
              <p className="mt-0.5 text-xs text-gray-500">
                publiees par {stats.agencesCount} agences
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 md:px-6">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">
              Selection
            </span>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-dark md:text-3xl">
              Annonces recentes a Abidjan
            </h2>
          </div>
          <Link
            href="/annonces"
            className="inline-flex items-center justify-center rounded-full border border-gray-200 px-5 py-2.5 text-sm font-semibold text-dark transition hover:border-gray-300"
          >
            Voir toutes les annonces
          </Link>
        </div>
        <div className="md:hidden">
          <PropertyCarouselLazy annonces={annonces} />
        </div>
        <div className="hidden md:block">
          <PropertyGrid annonces={annonces} />
        </div>
      </section>

      <section className="bg-gray-50 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">
            Pourquoi Nestymo
          </span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-dark">
            L&apos;immobilier sans mauvaise surprise.
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {POURQUOI.map(({ icon: Icon, title, text }) => (
              <article
                key={title}
                className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-6"
              >
                <Icon className="h-7 w-7 text-[#E02020]" aria-hidden />
                <h3 className="text-lg font-semibold text-dark">{title}</h3>
                <p className="text-sm leading-relaxed text-gray-600">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-gray-100 bg-white px-4 py-12 md:px-6">
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 text-center sm:grid-cols-3">
          <div>
            <p className="text-5xl font-bold tracking-tight text-[#E02020]">
              {stats.annoncesCount.toLocaleString('fr-FR')}
            </p>
            <p className="mx-auto mt-1 max-w-[180px] text-sm text-gray-500">
              Annonces publiees
            </p>
          </div>
          <div>
            <p className="text-5xl font-bold tracking-tight text-[#E02020]">
              {stats.agencesCount.toLocaleString('fr-FR')}
            </p>
            <p className="mx-auto mt-1 max-w-[180px] text-sm text-gray-500">
              Agences actives
            </p>
          </div>
          <div>
            <p className="text-5xl font-bold tracking-tight text-[#E02020]">
              {stats.villesCount.toLocaleString('fr-FR')}
            </p>
            <p className="mx-auto mt-1 max-w-[180px] text-sm text-gray-500">
              Villes couvertes
            </p>
          </div>
        </div>
      </section>

      <section className="bg-surface px-4 py-14 text-center md:px-6">
        <h2 className="text-xl font-bold text-dark md:text-2xl">
          Vous etes une agence immobiliere ? Rejoignez Nestymo
        </h2>
        <a
          href="https://app.nestymo.ci"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block rounded-lg bg-primary px-8 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover"
        >
          Creer mon espace pro
        </a>
      </section>

      <Footer />
    </>
  )
}
