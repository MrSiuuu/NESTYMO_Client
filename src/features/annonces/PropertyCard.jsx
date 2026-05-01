import Image from 'next/image'
import Link from 'next/link'
import { selectPrimaryPhoto } from './selectPrimaryPhoto'

// Format prix — jamais de symbole €
function formatPrix(prix) {
  if (!prix || prix === 0) return 'Prix sur demande'
  return new Intl.NumberFormat('fr-FR').format(prix) + ' FCFA'
}

// Badges transaction — valeurs : louer, vendre, bail (design system CONTEXT)
function badgeTransaction(transaction) {
  if (transaction === 'louer')
    return { label: 'LOUER', bg: '#E1F5EE', text: '#0F6E56' }
  if (transaction === 'vendre')
    return { label: 'VENDRE', bg: '#FDE8E8', text: '#C0392B' }
  if (transaction === 'bail')
    return { label: 'BAIL', bg: '#FAEEDA', text: '#854F0B' }
  return null
}

function getInitiales(nom) {
  if (!nom || !nom.trim()) return '?'
  const parts = nom.trim().split(/\s+/)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return nom.slice(0, 2).toUpperCase()
}

export default function PropertyCard({ annonce, priority }) {
  const photoUrl = selectPrimaryPhoto(annonce.photos)
  const imageSrc = photoUrl ?? '/images/placeholder.jpg'
  const badge = badgeTransaction(annonce.transaction)
  const localisation =
    annonce.quartiers?.nom ?? annonce.villes?.nom ?? null
  const agence = annonce.agences

  return (
    <Link
      href={`/annonces/${annonce.id}`}
      className="block overflow-hidden rounded-xl bg-white shadow-md transition hover:shadow-lg"
    >
      <article>
        <div className="relative aspect-[4/3] w-full">
          <Image
            src={imageSrc}
            alt={annonce.titre ?? 'Annonce'}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            priority={Boolean(priority)}
          />
          {badge ? (
            <span
              className="absolute left-3 top-3 rounded px-2 py-0.5 text-xs font-semibold"
              style={{ backgroundColor: badge.bg, color: badge.text }}
            >
              {badge.label}
            </span>
          ) : null}
        </div>
        <div className="p-4">
          <p className="text-lg font-bold text-[#0F1923]">
            {formatPrix(annonce.prix)}
          </p>
          <h3 className="mt-1 line-clamp-2 text-sm font-medium text-[#0F1923] md:text-base">
            {annonce.titre}
          </h3>
          {localisation ? (
            <p className="mt-2 text-sm text-[#6B7280]">{localisation}</p>
          ) : null}
          <div className="mt-2 flex flex-wrap gap-3 text-sm text-[#6B7280]">
            {annonce.chambres != null ? (
              <span>{annonce.chambres} ch.</span>
            ) : null}
            {annonce.surface != null ? (
              <span>{annonce.surface} m²</span>
            ) : null}
          </div>
          {agence ? (
            <div className="mt-4 hidden items-center gap-2 border-t border-[#E8E3D8] pt-4 sm:flex">
              {agence.logo ? (
                <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full">
                  <Image
                    src={agence.logo}
                    alt=""
                    width={32}
                    height={32}
                    className="h-8 w-8 object-cover"
                  />
                </span>
              ) : (
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FAF6EF] text-xs font-semibold text-[#0F1923]"
                  aria-hidden
                >
                  {getInitiales(agence.nom)}
                </span>
              )}
              <span className="truncate text-sm font-medium text-[#0F1923]">
                {agence.nom}
              </span>
            </div>
          ) : null}
        </div>
      </article>
    </Link>
  )
}
