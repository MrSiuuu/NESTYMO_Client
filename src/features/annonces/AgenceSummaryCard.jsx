import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import AgenceAvatar from '@/components/AgenceAvatar'
import BadgeVerifie from '@/components/BadgeVerifie'

export default function AgenceSummaryCard({ agence }) {
  if (!agence?.id) return null

  const verified = agence.verification_status === 'verified'

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6">
      <h2 className="text-xl font-semibold tracking-tight text-dark">L&apos;agence</h2>
      <div className="mt-5 grid grid-cols-1 items-center gap-4 sm:grid-cols-[auto_1fr_auto]">
        <AgenceAvatar agence={agence} size={80} />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-lg font-semibold text-dark">{agence.nom}</p>
            {verified ? <BadgeVerifie /> : null}
          </div>
        </div>
        <Link
          href={`/agences/${agence.id}`}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-gray-200 px-4 text-sm font-semibold text-dark transition hover:border-gray-300 sm:justify-self-end"
        >
          Voir ses annonces
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </section>
  )
}
