import { MapPin } from 'lucide-react'
import { formatPrix, formatDatePublication } from './annoncesService'

function badgeTransaction(transaction) {
  if (transaction === 'louer') return { label: 'A louer', className: 'bg-[#E02020] text-white' }
  if (transaction === 'vendre') return { label: 'A vendre', className: 'bg-dark text-white' }
  if (transaction === 'bail') return { label: 'Bail commercial', className: 'bg-dark text-white' }
  return null
}

function SpecCell({ label, value }) {
  if (value == null || value === '') return null
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
        {label}
      </span>
      <span className="text-lg font-semibold text-dark">{value}</span>
    </div>
  )
}

export default function BlocIdentite({ annonce }) {
  const badge = badgeTransaction(annonce.transaction)
  const datePub = formatDatePublication(annonce.created_at)
  const q = annonce.quartiers?.nom
  const v = annonce.villes?.nom
  let ligneVille = null
  if (q && v) ligneVille = `${q}, ${v}`
  else if (v) ligneVille = v
  else if (q) ligneVille = q

  const specs = [
    annonce.surface != null ? { label: 'Surface', value: `${annonce.surface} m²` } : null,
    annonce.chambres != null ? { label: 'Chambres', value: String(annonce.chambres) } : null,
    annonce.salles_de_bain != null
      ? { label: 'Salles de bain', value: String(annonce.salles_de_bain) }
      : null,
  ].filter(Boolean)

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        {badge ? (
          <span
            className={`rounded-md px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${badge.className}`}
          >
            {badge.label}
          </span>
        ) : null}
        {annonce.types_biens?.nom ? (
          <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
            {annonce.types_biens.nom}
          </span>
        ) : null}
        {annonce.reference ? (
          <span className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-600">
            Ref · {annonce.reference}
          </span>
        ) : null}
      </div>

      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-dark md:text-4xl">
            {annonce.titre}
          </h1>
          {(ligneVille || datePub) && (
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-gray-600">
              {ligneVille ? (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 shrink-0" aria-hidden />
                  {ligneVille}
                </span>
              ) : null}
              {ligneVille && datePub ? (
                <span className="h-1 w-1 rounded-full bg-gray-300" aria-hidden />
              ) : null}
              {datePub ? <span>{datePub}</span> : null}
            </div>
          )}
        </div>
        <div className="shrink-0 md:text-right">
          <p className="text-4xl font-bold tracking-tight text-[#E02020] md:text-5xl">
            {formatPrix(annonce.prix)}
          </p>
        </div>
      </div>

      {specs.length > 0 ? (
        <div className="grid grid-cols-2 gap-6 border-y border-gray-100 py-6 sm:grid-cols-4">
          {specs.map((s) => (
            <SpecCell key={s.label} label={s.label} value={s.value} />
          ))}
        </div>
      ) : null}
    </section>
  )
}
