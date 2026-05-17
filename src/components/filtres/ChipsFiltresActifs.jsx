import Link from 'next/link'

function spVersObjet(sp) {
  if (!sp || typeof sp !== 'object') return {}
  const o = {}
  for (const [k, v] of Object.entries(sp)) {
    if (v === undefined) continue
    o[k] = Array.isArray(v) ? v[0] : v
  }
  return o
}

function urlSansFiltres(sp, keysToRemove) {
  const base = spVersObjet(sp)
  const p = new URLSearchParams()
  keysToRemove.forEach((k) => delete base[k])
  delete base.page
  Object.entries(base).forEach(([k, v]) => {
    if (v === null || v === undefined || v === '') return
    p.set(k, String(v))
  })
  const qs = p.toString()
  return qs ? `/annonces?${qs}` : '/annonces'
}

const LABEL_TX = {
  louer: 'Louer',
  vendre: 'Vendre',
  bail: 'Bail',
}

function fcfa(n) {
  return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA'
}

export default function ChipsFiltresActifs({
  filtres,
  villes,
  typesBiens,
  quartiers,
  searchParams,
}) {
  const f = filtres
  const chips = []

  if (f.commune) {
    const nom = villes.find((v) => v.id === f.commune)?.nom ?? f.commune
    chips.push({
      key: 'commune',
      label: nom,
      removeKeys: ['commune', 'quartier'],
    })
  }
  if (f.quartier) {
    const nom =
      quartiers.find((q) => q.id === f.quartier)?.nom ?? f.quartier
    chips.push({
      key: 'quartier',
      label: nom,
      removeKeys: ['quartier'],
    })
  }
  if (f.transaction) {
    chips.push({
      key: 'transaction',
      label: LABEL_TX[f.transaction] ?? f.transaction,
      removeKeys: ['transaction'],
    })
  }
  if (f.prix_min !== null && f.prix_min !== undefined) {
    chips.push({
      key: 'prix_min',
      label: `Min ${fcfa(f.prix_min)}`,
      removeKeys: ['prix_min'],
    })
  }
  if (f.prix_max !== null && f.prix_max !== undefined) {
    chips.push({
      key: 'prix_max',
      label: `Max ${fcfa(f.prix_max)}`,
      removeKeys: ['prix_max'],
    })
  }
  if (f.type_bien) {
    const nom = typesBiens.find((t) => t.id === f.type_bien)?.nom ?? f.type_bien
    chips.push({
      key: 'type_bien',
      label: nom,
      removeKeys: ['type_bien'],
    })
  }
  if (f.chambres_min !== null && f.chambres_min !== undefined) {
    chips.push({
      key: 'chambres_min',
      label: `${f.chambres_min}+ chambres`,
      removeKeys: ['chambres_min'],
    })
  }

  if (chips.length === 0) return null

  return (
    <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {chips.map((c) => (
        <Link
          key={c.key}
          href={urlSansFiltres(searchParams, c.removeKeys)}
          className="inline-flex shrink-0 items-center gap-1 rounded-full border border-border bg-gray-100 px-3 py-1 text-xs text-dark"
        >
          <span>{c.label}</span>
          <span className="font-bold text-gray" aria-hidden>
            x
          </span>
        </Link>
      ))}
    </div>
  )
}

