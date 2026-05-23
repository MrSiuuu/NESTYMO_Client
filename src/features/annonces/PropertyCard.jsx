'use client'

import Image from 'next/image'
import Link from 'next/link'
import { selectPrimaryPhoto } from './selectPrimaryPhoto'
import AnnonceFavoriButton from './AnnonceFavoriButton'
import AgenceAvatar from '@/components/AgenceAvatar'

function formatPrix(prix) {
  if (!prix || prix === 0) return 'Prix sur demande'
  return new Intl.NumberFormat('fr-FR').format(prix) + ' FCFA'
}

function badgeTransaction(transaction) {
  if (transaction === 'louer')
    return { label: 'LOUER', bg: 'bg-emerald-50', text: 'text-emerald-800' }
  if (transaction === 'vendre')
    return { label: 'VENDRE', bg: 'bg-red-50', text: 'text-red-800' }
  if (transaction === 'bail')
    return { label: 'BAIL', bg: 'bg-amber-50', text: 'text-amber-900' }
  return null
}

const PLACEHOLDER = '/images/placeholder.svg'

export default function PropertyCard({ annonce, priority, initialFavori = false }) {
  const photoUrl = selectPrimaryPhoto(annonce.photos)
  const imageSrc = photoUrl ?? PLACEHOLDER
  const badge = badgeTransaction(annonce.transaction)
  const localisation =
    annonce.quartiers?.nom ?? annonce.villes?.nom ?? null
  const agence = annonce.agences

  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-white shadow-sm transition hover:shadow-md">
      <div className="absolute right-2 top-2 z-10">
        <AnnonceFavoriButton
          annonceId={annonce.id}
          initialFavori={initialFavori}
          variant="card"
        />
      </div>
      <Link
        href={`/annonces/${annonce.id}`}
        prefetch={false}
        className="block"
      >
        <article>
          <div className="relative aspect-[4/3] w-full bg-gray-100">
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
                className={`absolute left-3 top-3 rounded px-2 py-0.5 text-xs font-semibold ${badge.bg} ${badge.text}`}
              >
                {badge.label}
              </span>
            ) : null}
          </div>
          <div className="p-4">
            <p className="text-lg font-bold text-primary">{formatPrix(annonce.prix)}</p>
            <h3 className="mt-1 line-clamp-2 text-sm font-medium text-dark md:text-base">
              {annonce.titre}
            </h3>
            {localisation ? (
              <p className="mt-2 text-sm text-gray">{localisation}</p>
            ) : null}
            <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray">
              {annonce.chambres != null ? (
                <span>{annonce.chambres} ch.</span>
              ) : null}
              {annonce.surface != null ? (
                <span>{annonce.surface} m2</span>
              ) : null}
            </div>
            {agence ? (
              <div className="mt-4 hidden items-center gap-2 border-t border-border pt-4 sm:flex">
                <AgenceAvatar agence={agence} size={32} />
                <span className="truncate text-sm font-medium text-dark">
                  {agence.nom}
                </span>
              </div>
            ) : null}
          </div>
        </article>
      </Link>
    </div>
  )
}

