'use client'

import { useMemo, useState } from 'react'
import AgenceTile from './AgenceTile'

const PAGE_SIZE = 12

const VILLES_FILTRE = [
  'Toutes',
  'Cocody',
  'Plateau',
  'Marcory',
  'Yopougon',
  'Riviera',
  'Bingerville',
]

export default function AgencesListing({ agences }) {
  const [ville, setVille] = useState('Toutes')
  const [visible, setVisible] = useState(PAGE_SIZE)

  const filtered = useMemo(() => {
    if (ville === 'Toutes') return agences
    const needle = ville.toLowerCase()
    return agences.filter((a) =>
      (a.villeLabel ?? '').toLowerCase().includes(needle)
    )
  }, [agences, ville])

  const shown = filtered.slice(0, visible)
  const hasMore = visible < filtered.length

  return (
    <>
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-2 md:mx-0 md:flex-wrap md:overflow-visible md:px-0">
        {VILLES_FILTRE.map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => {
              setVille(v)
              setVisible(PAGE_SIZE)
            }}
            className={`shrink-0 cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition ${
              ville === v
                ? 'border-dark bg-dark text-white'
                : 'border-gray-200 bg-white text-dark hover:border-gray-300'
            }`}
          >
            {v}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <p className="py-16 text-center text-gray">
          Aucune agence pour ce filtre.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((agence) => (
            <AgenceTile key={agence.id} agence={agence} />
          ))}
        </div>
      )}

      {hasMore ? (
        <div className="flex justify-center py-12">
          <button
            type="button"
            onClick={() => setVisible((n) => n + PAGE_SIZE)}
            className="cursor-pointer rounded-full border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-dark transition hover:border-gray-300"
          >
            Charger plus d&apos;agences
          </button>
        </div>
      ) : null}
    </>
  )
}
