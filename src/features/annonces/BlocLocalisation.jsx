import { MapPin } from 'lucide-react'

export default function BlocLocalisation({ annonce }) {
  const q = annonce.quartiers?.nom
  const v = annonce.villes?.nom
  const adresse = annonce.adresse?.trim()
  const lat = annonce.latitude
  const lng = annonce.longitude

  const hasGeo =
    lat != null &&
    lng != null &&
    !Number.isNaN(Number(lat)) &&
    !Number.isNaN(Number(lng))

  const hasQuartierOuVille = Boolean(q) || Boolean(v)
  const hasAdresse = Boolean(adresse)
  const shouldShow = hasQuartierOuVille || hasAdresse || hasGeo

  if (!shouldShow) return null

  let ligneQuartierVille = ''
  if (q && v) ligneQuartierVille = `${v} - ${q}`
  else if (q) ligneQuartierVille = q
  else if (v) ligneQuartierVille = v

  return (
    <section className="rounded-xl border border-border bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-dark">Localisation</h2>

      {hasAdresse ? (
        <p className="mt-4 text-dark">{adresse}</p>
      ) : null}

      {ligneQuartierVille ? (
        <p className="mt-4 flex gap-2 text-dark">
          <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
          <span>{ligneQuartierVille}</span>
        </p>
      ) : null}

      {hasGeo ? (
        <p className="mt-3 text-sm text-gray">Coordonnees GPS disponibles</p>
      ) : null}
    </section>
  )
}

