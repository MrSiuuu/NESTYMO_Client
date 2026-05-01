function IconPin() {
  return (
    <svg
      className="mt-0.5 h-5 w-5 shrink-0 text-[#D97B00]"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  )
}

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
  if (q && v) ligneQuartierVille = `${q}, ${v}`
  else if (q) ligneQuartierVille = q
  else if (v) ligneQuartierVille = v

  return (
    <section className="rounded-xl bg-white p-6 shadow-md">
      <h2 className="font-playfair text-xl font-semibold text-[#0F1923]">
        Localisation
      </h2>

      {ligneQuartierVille ? (
        <p className="mt-4 flex gap-2 text-[#0F1923]">
          <IconPin />
          <span>{ligneQuartierVille}</span>
        </p>
      ) : null}

      {hasAdresse ? (
        <p
          className={
            ligneQuartierVille ? 'mt-2 pl-7 text-[#6B7280]' : 'mt-4 text-[#6B7280]'
          }
        >
          {adresse}
        </p>
      ) : null}

      {hasGeo ? (
        <p className="mt-4 text-sm text-[#6B7280]">
          📍 Coordonnées disponibles
        </p>
      ) : null}
    </section>
  )
}
