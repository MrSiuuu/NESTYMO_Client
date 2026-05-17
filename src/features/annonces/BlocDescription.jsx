'use client'

import { useState } from 'react'

function formatEquipmentLabel(key) {
  if (!key || typeof key !== 'string') return key
  return key
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ')
}

export default function BlocDescription({ annonce }) {
  const desc = annonce.description?.trim()
  const raw = annonce.equipements
  const equipements =
    raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {}
  const actifs = Object.entries(equipements).filter(([, v]) => v === true)

  const showDesc = Boolean(desc)
  const showEquip = actifs.length > 0
  const [expanded, setExpanded] = useState(false)

  if (!showDesc && !showEquip) return null

  return (
    <div className="space-y-8">
      {showDesc ? (
        <section className="rounded-xl border border-border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-dark">Description</h2>
          <div
            className={`mt-4 whitespace-pre-line text-dark leading-relaxed ${
              expanded ? '' : 'line-clamp-3'
            }`}
          >
            {annonce.description}
          </div>
          {desc.length > 180 ? (
            <button
              type="button"
              onClick={() => setExpanded((e) => !e)}
              className="mt-2 cursor-pointer text-sm font-semibold text-primary hover:underline"
            >
              {expanded ? 'Voir moins' : 'Voir plus'}
            </button>
          ) : null}
        </section>
      ) : null}

      {showEquip ? (
        <section className="rounded-xl border border-border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-dark">Equipements</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {actifs.map(([key]) => (
              <span
                key={key}
                className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700"
              >
                {formatEquipmentLabel(key)}
              </span>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}

