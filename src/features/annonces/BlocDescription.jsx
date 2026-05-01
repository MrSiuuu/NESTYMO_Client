const LABELS_EQUIPEMENTS = {
  climatisation: 'Climatisation',
  eau_chaude: 'Eau chaude',
  groupe_electrogene: 'Groupe électrogène',
  gardien: 'Gardien',
  piscine: 'Piscine',
  parking: 'Parking / Garage',
  internet: 'Internet / WiFi',
  cuisine_equipee: 'Cuisine équipée',
  terrasse: 'Terrasse / Balcon',
  ascenseur: 'Ascenseur',
}

export default function BlocDescription({ annonce }) {
  const desc = annonce.description?.trim()
  const raw = annonce.equipements
  const equipements =
    raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {}
  const actifs = Object.entries(equipements).filter(
    ([_, v]) => v === true
  )

  const showDesc = Boolean(desc)
  const showEquip = actifs.length > 0

  if (!showDesc && !showEquip) return null

  return (
    <div className="space-y-8">
      {showDesc ? (
        <section className="rounded-xl bg-white p-6 shadow-md">
          <h2 className="font-playfair text-xl font-semibold text-[#0F1923]">
            Description
          </h2>
          <div className="mt-4 whitespace-pre-line text-[#0F1923] leading-relaxed">
            {annonce.description}
          </div>
        </section>
      ) : null}

      {showEquip ? (
        <section className="rounded-xl bg-white p-6 shadow-md">
          <h2 className="font-playfair text-xl font-semibold text-[#0F1923]">
            Équipements
          </h2>
          <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {actifs.map(([key]) => {
              const label = LABELS_EQUIPEMENTS[key] ?? key
              return (
                <li
                  key={key}
                  className="rounded-lg border border-[#E8E3D8] bg-[#FAF6EF] px-3 py-2 text-sm text-[#0F1923]"
                >
                  {label}
                </li>
              )
            })}
          </ul>
        </section>
      ) : null}
    </div>
  )
}
