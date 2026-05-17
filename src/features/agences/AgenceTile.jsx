import Link from 'next/link'
import { Building, Bookmark, ArrowRight } from 'lucide-react'
import AgenceAvatar from '@/components/AgenceAvatar'
import BadgeVerifie from '@/components/BadgeVerifie'

function membreAnnee(createdAt) {
  if (!createdAt) return null
  return new Date(createdAt).getFullYear()
}

export default function AgenceTile({ agence }) {
  const ville = agence.villeLabel ?? "Cote d'Ivoire"
  const annee = membreAnnee(agence.created_at)
  const verified = agence.verification_status === 'verified'

  return (
    <Link href={`/agences/${agence.id}`} className="group block h-full">
      <article className="flex h-full flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300">
        <div className="flex items-center gap-3">
          <AgenceAvatar agence={agence} size={56} />
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-dark">{agence.nom}</p>
            <p className="mt-0.5 text-sm text-gray-500">{ville}</p>
          </div>
        </div>

        {verified ? <BadgeVerifie /> : null}

        <div className="flex flex-wrap items-center gap-4 border-t border-gray-100 pt-4 text-sm text-gray-600">
          <span className="inline-flex items-center gap-1.5">
            <Building className="h-3.5 w-3.5 shrink-0" aria-hidden />
            {agence.nbAnnonces} annonce{agence.nbAnnonces > 1 ? 's' : ''}
          </span>
          {annee ? (
            <span className="inline-flex items-center gap-1.5">
              <Bookmark className="h-3.5 w-3.5 shrink-0" aria-hidden />
              Membre depuis {annee}
            </span>
          ) : null}
        </div>

        <span className="inline-flex h-9 w-fit items-center gap-2 self-start rounded-full bg-black px-3.5 text-sm font-semibold text-white transition group-hover:bg-gray-800">
          Voir les annonces
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </span>
      </article>
    </Link>
  )
}
