import Link from 'next/link'

/**
 * Filtres desktop - formulaire GET, submit via « Appliquer »
 */
export default function FiltresSidebarDesktop({
  villes,
  typesBiens,
  quartiers,
  filtresActifs,
}) {
  const f = filtresActifs

  return (
    <form
      method="GET"
      action="/annonces"
      className="sticky top-24 space-y-0 rounded-xl border border-border bg-white p-5 shadow-sm"
    >
      <div className="pb-4">
        <p className="mb-2 text-sm font-medium text-dark">Commune</p>
        <select
          name="commune"
          defaultValue={f.commune ?? ''}
          className="w-full rounded-lg border border-border px-3 py-2 text-sm text-dark"
        >
          <option value="">Toutes les communes</option>
          {villes.map((v) => (
            <option key={v.id} value={v.id}>
              {v.nom}
            </option>
          ))}
        </select>
      </div>

      <div className="border-t border-border py-4">
        <p className="mb-2 text-sm font-medium text-dark">Quartier</p>
        <select
          key={f.commune ?? 'none'}
          name="quartier"
          defaultValue={f.quartier ?? ''}
          disabled={!f.commune || quartiers.length === 0}
          className="w-full rounded-lg border border-border px-3 py-2 text-sm text-dark disabled:cursor-not-allowed disabled:bg-gray-100"
        >
          <option value="">Tous les quartiers</option>
          {quartiers.map((q) => (
            <option key={q.id} value={q.id}>
              {q.nom}
            </option>
          ))}
        </select>
      </div>

      <div className="border-t border-border py-4">
        <p className="mb-2 text-sm font-medium text-dark">Transaction</p>
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

      <div className="border-t border-border py-4">
        <p className="mb-2 text-sm font-medium text-dark">Budget (FCFA)</p>
        <div className="flex flex-col gap-2">
          <input
            type="number"
            name="prix_min"
            min={0}
            step={1000}
            placeholder="Min"
            defaultValue={f.prix_min ?? ''}
            className="w-full rounded-lg border border-border px-3 py-2 text-sm"
          />
          <input
            type="number"
            name="prix_max"
            min={0}
            step={1000}
            placeholder="Max"
            defaultValue={f.prix_max ?? ''}
            className="w-full rounded-lg border border-border px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="border-t border-border py-4">
        <p className="mb-2 text-sm font-medium text-dark">Type de bien</p>
        <select
          name="type_bien"
          defaultValue={f.type_bien ?? ''}
          className="w-full rounded-lg border border-border px-3 py-2 text-sm"
        >
          <option value="">Tous les types</option>
          {typesBiens.map((t) => (
            <option key={t.id} value={t.id}>
              {t.nom}
            </option>
          ))}
        </select>
      </div>

      <div className="border-t border-border py-4">
        <p className="mb-2 text-sm font-medium text-dark">Chambres min.</p>
        <select
          name="chambres_min"
          defaultValue={
            f.chambres_min != null ? String(f.chambres_min) : ''
          }
          className="w-full rounded-lg border border-border px-3 py-2 text-sm"
        >
          <option value="">Peu importe</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
        </select>
      </div>

      <div className="border-t border-border py-4">
        <p className="mb-2 text-sm font-medium text-dark">Tri</p>
        <select
          name="sort"
          defaultValue={f.sort ?? 'recent'}
          className="w-full rounded-lg border border-border px-3 py-2 text-sm"
        >
          <option value="recent">Plus recents</option>
          <option value="prix_asc">Prix croissant</option>
          <option value="prix_desc">Prix decroissant</option>
        </select>
      </div>

      <div className="border-t border-border pt-4">
        <button
          type="submit"
          className="w-full cursor-pointer rounded-lg bg-primary py-3 text-sm font-semibold text-white transition hover:bg-primary-hover"
        >
          Appliquer
        </button>
        <Link
          href="/annonces"
          className="mt-3 block w-full text-center text-sm text-gray hover:text-dark"
        >
          Reinitialiser
        </Link>
      </div>
    </form>
  )
}

