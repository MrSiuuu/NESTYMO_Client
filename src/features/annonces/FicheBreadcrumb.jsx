import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export default function FicheBreadcrumb({ annonce }) {
  const ville = annonce.villes?.nom
  const quartier = annonce.quartiers?.nom
  const type = annonce.types_biens?.nom
  const tx =
    annonce.transaction === 'louer'
      ? 'Location'
      : annonce.transaction === 'vendre'
        ? 'Vente'
        : null

  const segmentLieu = [tx, quartier ?? ville].filter(Boolean).join(' · ')

  return (
    <nav
      aria-label="Fil d'Ariane"
      className="mb-4 flex flex-wrap items-center gap-1 text-sm text-gray-500"
    >
      <Link href="/" className="hover:text-dark">
        Accueil
      </Link>
      <ChevronRight className="h-3 w-3 shrink-0" aria-hidden />
      <Link href="/annonces" className="hover:text-dark">
        Annonces
      </Link>
      {segmentLieu ? (
        <>
          <ChevronRight className="h-3 w-3 shrink-0" aria-hidden />
          <Link
            href={`/annonces${ville ? `?commune=${annonce.ville_id ?? ''}` : ''}`}
            className="hover:text-dark"
          >
            {segmentLieu}
          </Link>
        </>
      ) : null}
      <ChevronRight className="h-3 w-3 shrink-0" aria-hidden />
      <span className="text-gray-700">
        {type ?? annonce.titre?.slice(0, 40) ?? 'Annonce'}
      </span>
    </nav>
  )
}
