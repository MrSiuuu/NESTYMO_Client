import Link from 'next/link'

/**
 * Filtres desktop — formulaire GET, submit uniquement via « Appliquer »
 */
export default function FiltresSidebarDesktop({
  villes,
  typesBiens,
  filtresActifs,
}) {
  const f = filtresActifs

  return (
    <form
      method="GET"
      action="/annonces"
      className="sticky top-24 space-y-0 rounded-xl bg-white p-5 shadow-md"
    >
      {/* 1. Commune */}
      <div className="pb-4">
        <p className="mb-2 text-sm font-medium text-[#0F1923]">Commune</p>
        <select
          name="commune"
          defaultValue={f.commune ?? ''}
          className="w-full rounded-lg border border-[#E8E3D8] px-3 py-2 text-sm text-[#0F1923]"
        >
          <option value="">Toutes les communes</option>
          {villes.map((v) => (
            <option key={v.id} value={v.id}>
              {v.nom}
            </option>
          ))}
        </select>
      </div>

      <div className="border-t border-[#E8E3D8] py-4">
        <p className="mb-2 text-sm font-medium text-[#0F1923]">Transaction</p>
        <div className="flex flex-col gap-2 text-sm">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name="transaction"
              value=""
              defaultChecked={!f.transaction}
            />
            Tous
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name="transaction"
              value="louer"
              defaultChecked={f.transaction === 'louer'}
            />
            Louer
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name="transaction"
              value="vendre"
              defaultChecked={f.transaction === 'vendre'}
            />
            Vendre
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name="transaction"
              value="bail"
              defaultChecked={f.transaction === 'bail'}
            />
            Bail
          </label>
        </div>
      </div>

      <div className="border-t border-[#E8E3D8] py-4">
        <p className="mb-2 text-sm font-medium text-[#0F1923]">Budget (FCFA)</p>
        <div className="flex flex-col gap-2">
          <input
            type="number"
            name="prix_min"
            min={0}
            step={1000}
            placeholder="Min"
            defaultValue={f.prix_min ?? ''}
            className="w-full rounded-lg border border-[#E8E3D8] px-3 py-2 text-sm"
          />
          <input
            type="number"
            name="prix_max"
            min={0}
            step={1000}
            placeholder="Max"
            defaultValue={f.prix_max ?? ''}
            className="w-full rounded-lg border border-[#E8E3D8] px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="border-t border-[#E8E3D8] py-4">
        <p className="mb-2 text-sm font-medium text-[#0F1923]">Type de bien</p>
        <select
          name="type_bien"
          defaultValue={f.type_bien ?? ''}
          className="w-full rounded-lg border border-[#E8E3D8] px-3 py-2 text-sm"
        >
          <option value="">Tous les types</option>
          {typesBiens.map((t) => (
            <option key={t.id} value={t.id}>
              {t.nom}
            </option>
          ))}
        </select>
      </div>

      <div className="border-t border-[#E8E3D8] py-4">
        <p className="mb-2 text-sm font-medium text-[#0F1923]">Chambres min.</p>
        <select
          name="chambres_min"
          defaultValue={
            f.chambres_min != null ? String(f.chambres_min) : ''
          }
          className="w-full rounded-lg border border-[#E8E3D8] px-3 py-2 text-sm"
        >
          <option value="">Peu importe</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
        </select>
      </div>

      <div className="border-t border-[#E8E3D8] py-4">
        <p className="mb-2 text-sm font-medium text-[#0F1923]">Tri</p>
        <select
          name="sort"
          defaultValue={f.sort ?? 'recent'}
          className="w-full rounded-lg border border-[#E8E3D8] px-3 py-2 text-sm"
        >
          <option value="recent">Plus récents</option>
          <option value="prix_asc">Prix croissant</option>
          <option value="prix_desc">Prix décroissant</option>
        </select>
      </div>

      <div className="border-t border-[#E8E3D8] pt-4">
        <button
          type="submit"
          className="w-full rounded-lg bg-[#D97B00] py-3 text-sm font-medium text-white transition hover:bg-[#b86a00]"
        >
          Appliquer
        </button>
        <Link
          href="/annonces"
          className="mt-3 block w-full text-center text-sm text-[#6B7280] hover:text-[#0F1923]"
        >
          Réinitialiser
        </Link>
      </div>
    </form>
  )
}
