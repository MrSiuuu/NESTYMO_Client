import { formatPrix, formatDatePublication } from './annoncesService'

function badgeTransaction(transaction) {
  if (transaction === 'louer')
    return { label: 'LOUER', bg: '#E1F5EE', text: '#0F6E56' }
  if (transaction === 'vendre')
    return { label: 'VENDRE', bg: '#FDE8E8', text: '#C0392B' }
  if (transaction === 'bail')
    return { label: 'BAIL', bg: '#FAEEDA', text: '#854F0B' }
  return null
}

function IconSurface() {
  return (
    <svg
      className="h-5 w-5 shrink-0 text-[#6B7280]"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
      />
    </svg>
  )
}

function IconChambre() {
  return (
    <svg
      className="h-5 w-5 shrink-0 text-[#6B7280]"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
      />
    </svg>
  )
}

function IconSdb() {
  return (
    <svg
      className="h-5 w-5 shrink-0 text-[#6B7280]"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M10.5 3L12 2l1.5 1H21v6H3V3h7.5z"
      />
    </svg>
  )
}

export default function BlocIdentite({ annonce }) {
  const badge = badgeTransaction(annonce.transaction)
  const datePub = formatDatePublication(annonce.created_at)
  const q = annonce.quartiers?.nom
  const v = annonce.villes?.nom
  let localisation = null
  if (q && v) localisation = `${q}, ${v}`
  else if (q) localisation = q
  else if (v) localisation = v

  const parts = []
  if (annonce.surface != null) {
    parts.push(
      <span key="surf" className="inline-flex items-center gap-1.5">
        <IconSurface />
        {annonce.surface} m²
      </span>
    )
  }
  if (annonce.chambres != null) {
    parts.push(
      <span key="ch" className="inline-flex items-center gap-1.5">
        <IconChambre />
        {annonce.chambres} ch.
      </span>
    )
  }
  if (annonce.salles_de_bain != null) {
    parts.push(
      <span key="sdb" className="inline-flex items-center gap-1.5">
        <IconSdb />
        {annonce.salles_de_bain} sdb
      </span>
    )
  }

  return (
    <section className="rounded-xl bg-white p-6 shadow-md">
      <div className="flex flex-wrap items-center gap-2">
        {badge ? (
          <span
            className="rounded px-2 py-0.5 text-xs font-semibold"
            style={{ backgroundColor: badge.bg, color: badge.text }}
          >
            {badge.label}
          </span>
        ) : null}
        {annonce.types_biens?.nom ? (
          <span className="text-sm font-medium text-[#6B7280]">
            {annonce.types_biens.nom}
          </span>
        ) : null}
      </div>

      <h1 className="mt-3 font-playfair text-2xl font-bold text-[#0F1923] md:text-3xl">
        {annonce.titre}
      </h1>

      <p className="mt-4 text-3xl font-bold text-[#D97B00]">
        {formatPrix(annonce.prix)}
      </p>

      {datePub ? (
        <p className="mt-2 text-sm text-[#6B7280]">{datePub}</p>
      ) : null}

      {localisation ? (
        <p className="mt-4 text-[#0F1923]">{localisation}</p>
      ) : null}

      {parts.length > 0 ? (
        <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-[#0F1923]">
          {parts.map((node, i) => (
            <span key={i} className="inline-flex items-center gap-1.5">
              {i > 0 ? (
                <span className="select-none text-[#D1D5DB]" aria-hidden>
                  ·
                </span>
              ) : null}
              {node}
            </span>
          ))}
        </p>
      ) : null}
    </section>
  )
}
