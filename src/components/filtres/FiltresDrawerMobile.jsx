'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Filter, X } from 'lucide-react'

function compteFiltres(f) {
  let n = 0
  if (f.commune) n++
  if (f.quartier) n++
  if (f.transaction) n++
  if (f.prix_min !== null && f.prix_min !== undefined) n++
  if (f.prix_max !== null && f.prix_max !== undefined) n++
  if (f.type_bien) n++
  if (f.chambres_min !== null && f.chambres_min !== undefined) n++
  return n
}

function draftVersURL(draft) {
  const p = new URLSearchParams()
  if (draft.commune) p.set('commune', draft.commune)
  if (draft.quartier) p.set('quartier', draft.quartier)
  if (draft.transaction) p.set('transaction', draft.transaction)
  if (draft.prix_min !== '' && draft.prix_min != null)
    p.set('prix_min', String(draft.prix_min))
  if (draft.prix_max !== '' && draft.prix_max != null)
    p.set('prix_max', String(draft.prix_max))
  if (draft.type_bien) p.set('type_bien', draft.type_bien)
  if (draft.chambres_min !== '' && draft.chambres_min != null)
    p.set('chambres_min', String(draft.chambres_min))
  if (draft.sort && draft.sort !== 'recent') p.set('sort', draft.sort)
  const qs = p.toString()
  return qs ? `/annonces?${qs}` : '/annonces'
}

export default function FiltresDrawerMobile({
  villes,
  typesBiens,
  quartiers,
  filtresActifs,
}) {
  const router = useRouter()
  const [ouvert, setOuvert] = useState(false)
  const [draft, setDraft] = useState(() => ({ ...filtresActifs }))

  function ouvrir() {
    setDraft({ ...filtresActifs })
    setOuvert(true)
  }

  const nb = compteFiltres(filtresActifs)

  function appliquer() {
    router.push(draftVersURL(draft))
    setOuvert(false)
  }

  function reinitialiser() {
    setDraft({
      commune: null,
      quartier: null,
      transaction: null,
      prix_min: null,
      prix_max: null,
      type_bien: null,
      chambres_min: null,
      sort: 'recent',
    })
  }

  return (
    <>
      <button
        type="button"
        onClick={ouvrir}
        className="flex cursor-pointer items-center gap-2 rounded-lg bg-dark px-4 py-2 text-sm text-white md:hidden"
      >
        <Filter className="h-4 w-4" aria-hidden />
        Filtres{nb > 0 ? ` (${nb})` : ''}
      </button>

      {ouvert ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 cursor-pointer bg-black/40"
            aria-label="Fermer"
            onClick={() => setOuvert(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 flex max-h-[92vh] flex-col rounded-t-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <span className="font-medium text-dark">Filtres</span>
              <button
                type="button"
                className="cursor-pointer p-2 text-gray"
                onClick={() => setOuvert(false)}
                aria-label="Fermer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
              <div className="py-3">
                <p className="mb-2 text-sm font-medium text-dark">Commune</p>
                <select
                  value={draft.commune ?? ''}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      commune: e.target.value || null,
                      quartier: null,
                    }))
                  }
                  className="w-full rounded-lg border border-border px-3 py-3 text-sm"
                >
                  <option value="">Toutes les communes</option>
                  {villes.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.nom}
                    </option>
                  ))}
                </select>
              </div>

              <div className="border-t border-border py-3">
                <p className="mb-2 text-sm font-medium text-dark">Quartier</p>
                <select
                  value={draft.quartier ?? ''}
                  disabled={!draft.commune || quartiers.length === 0}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      quartier: e.target.value || null,
                    }))
                  }
                  className="w-full rounded-lg border border-border px-3 py-3 text-sm disabled:bg-gray-100"
                >
                  <option value="">Tous les quartiers</option>
                  {quartiers.map((q) => (
                    <option key={q.id} value={q.id}>
                      {q.nom}
                    </option>
                  ))}
                </select>
              </div>

              <div className="border-t border-border py-3">
                <p className="mb-2 text-sm font-medium text-dark">Transaction</p>
                <div className="flex flex-col gap-3 text-sm">
                  {[
                    ['', 'Tous'],
                    ['louer', 'Louer'],
                    ['vendre', 'Vendre'],
                    ['bail', 'Bail'],
                  ].map(([val, label]) => (
                    <label
                      key={val || 'tous'}
                      className="flex cursor-pointer items-center gap-2"
                    >
                      <input
                        type="radio"
                        name="tx-mobile"
                        checked={(draft.transaction ?? '') === val}
                        onChange={() =>
                          setDraft((d) => ({
                            ...d,
                            transaction: val || null,
                          }))
                        }
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="border-t border-border py-3">
                <p className="mb-2 text-sm font-medium text-dark">Budget (FCFA)</p>
                <input
                  type="number"
                  min={0}
                  step={1000}
                  placeholder="Min"
                  value={draft.prix_min ?? ''}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      prix_min: e.target.value === '' ? null : e.target.value,
                    }))
                  }
                  className="mb-2 w-full rounded-lg border border-border px-3 py-3 text-sm"
                />
                <input
                  type="number"
                  min={0}
                  step={1000}
                  placeholder="Max"
                  value={draft.prix_max ?? ''}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      prix_max: e.target.value === '' ? null : e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-border px-3 py-3 text-sm"
                />
              </div>

              <div className="border-t border-border py-3">
                <p className="mb-2 text-sm font-medium text-dark">Type de bien</p>
                <select
                  value={draft.type_bien ?? ''}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      type_bien: e.target.value || null,
                    }))
                  }
                  className="w-full rounded-lg border border-border px-3 py-3 text-sm"
                >
                  <option value="">Tous les types</option>
                  {typesBiens.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.nom}
                    </option>
                  ))}
                </select>
              </div>

              <div className="border-t border-border py-3">
                <p className="mb-2 text-sm font-medium text-dark">Chambres min.</p>
                <select
                  value={
                    draft.chambres_min != null ? String(draft.chambres_min) : ''
                  }
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      chambres_min: e.target.value
                        ? Number(e.target.value)
                        : null,
                    }))
                  }
                  className="w-full rounded-lg border border-border px-3 py-3 text-sm"
                >
                  <option value="">Peu importe</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                </select>
              </div>

              <div className="border-t border-border py-3">
                <p className="mb-2 text-sm font-medium text-dark">Tri</p>
                <select
                  value={draft.sort ?? 'recent'}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, sort: e.target.value }))
                  }
                  className="w-full rounded-lg border border-border px-3 py-3 text-sm"
                >
                  <option value="recent">Plus recents</option>
                  <option value="prix_asc">Prix croissant</option>
                  <option value="prix_desc">Prix decroissant</option>
                </select>
              </div>
            </div>

            <div
              className="flex gap-3 border-t border-border bg-white p-4"
              style={{
                paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
              }}
            >
              <button
                type="button"
                onClick={() => {
                  reinitialiser()
                }}
                className="flex-1 cursor-pointer rounded-lg border border-border py-3 text-sm font-medium text-dark"
              >
                Reinitialiser
              </button>
              <button
                type="button"
                onClick={appliquer}
                className="flex-1 cursor-pointer rounded-lg bg-primary py-3 text-sm font-semibold text-white"
              >
                Appliquer
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

