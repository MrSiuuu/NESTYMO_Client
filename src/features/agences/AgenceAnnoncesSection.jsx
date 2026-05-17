'use client'

import { useMemo, useState } from 'react'
import PropertyGrid from '../annonces/PropertyGrid'
import Pagination from '@/components/Pagination'

const FILTRES = [
  { id: 'all', label: 'Tout' },
  { id: 'louer', label: 'A louer' },
  { id: 'vendre', label: 'A vendre' },
]

export default function AgenceAnnoncesSection({
  annonces,
  agenceNom,
  page,
  totalPages,
  searchParams,
  agenceId,
}) {
  const [filtre, setFiltre] = useState('all')

  const filtered = useMemo(() => {
    if (filtre === 'all') return annonces
    return annonces.filter((a) => a.transaction === filtre)
  }, [annonces, filtre])

  return (
    <section className="py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="text-2xl font-semibold tracking-tight text-dark">
          Les annonces de {agenceNom}
        </h2>
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          {FILTRES.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFiltre(f.id)}
              className={`shrink-0 cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition ${
                filtre === f.id
                  ? 'border-dark bg-dark text-white'
                  : 'border-gray-200 bg-white text-dark hover:border-gray-300'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-gray-500">
          Aucune annonce pour ce filtre.
        </p>
      ) : (
        <>
          <div className="mt-8">
            <PropertyGrid annonces={filtered} />
          </div>
          {filtre === 'all' && totalPages > 1 ? (
            <Pagination
              page={page}
              totalPages={totalPages}
              searchParams={searchParams}
              variant="agence"
              agenceId={agenceId}
            />
          ) : null}
        </>
      )}
    </section>
  )
}
