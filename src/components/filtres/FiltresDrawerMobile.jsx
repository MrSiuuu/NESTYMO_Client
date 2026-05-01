'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

function IconFiltre() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
      />
    </svg>
  )
}

function compteFiltres(f) {
  let n = 0
  if (f.commune) n++
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
  filtresActifs,
}) {
  const router = useRouter()
  const [ouvert, setOuvert] = useState(false)
  const [draft, setDraft] = useState(() => ({ ...filtresActifs }))

  useEffect(() => {
    setDraft({ ...filtresActifs })
  }, [
    filtresActifs.commune,
    filtresActifs.transaction,
    filtresActifs.prix_min,
    filtresActifs.prix_max,
    filtresActifs.type_bien,
    filtresActifs.chambres_min,
    filtresActifs.sort,
  ])

  const nb = compteFiltres(filtresActifs)

  function appliquer() {
    router.push(draftVersURL(draft))
    setOuvert(false)
  }

  function reinitialiser() {
    setDraft({
      commune: null,
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
        onClick={() => setOuvert(true)}
        className="flex items-center gap-2 rounded-lg bg-[#1A1A2E] px-4 py-2 text-sm text-white md:hidden"
      >
        <IconFiltre />
        Filtres{nb > 0 ? ` (${nb})` : ''}
      </button>

      {ouvert ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Fermer"
            onClick={() => setOuvert(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 flex max-h-[92vh] flex-col rounded-t-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-[#E8E3D8] px-4 py-3">
              <span className="font-medium text-[#0F1923]">Filtres</span>
              <button
                type="button"
                className="p-2 text-xl leading-none text-[#6B7280]"
                onClick={() => setOuvert(false)}
                aria-label="Fermer"
              >
                ✕
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
              <div className="py-3">
                <p className="mb-2 text-sm font-medium text-[#0F1923]">
                  Commune
                </p>
                <select
                  value={draft.commune ?? ''}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      commune: e.target.value || null,
                    }))
                  }
                  className="w-full rounded-lg border border-[#E8E3D8] px-3 py-3 text-sm"
                >
                  <option value="">Toutes les communes</option>
                  {villes.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.nom}
                    </option>
                  ))}
                </select>
              </div>

              <div className="border-t border-[#E8E3D8] py-3">
                <p className="mb-2 text-sm font-medium text-[#0F1923]">
                  Transaction
                </p>
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

              <div className="border-t border-[#E8E3D8] py-3">
                <p className="mb-2 text-sm font-medium text-[#0F1923]">
                  Budget (FCFA)
                </p>
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
                  className="mb-2 w-full rounded-lg border border-[#E8E3D8] px-3 py-3 text-sm"
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
                  className="w-full rounded-lg border border-[#E8E3D8] px-3 py-3 text-sm"
                />
              </div>

              <div className="border-t border-[#E8E3D8] py-3">
                <p className="mb-2 text-sm font-medium text-[#0F1923]">
                  Type de bien
                </p>
                <select
                  value={draft.type_bien ?? ''}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      type_bien: e.target.value || null,
                    }))
                  }
                  className="w-full rounded-lg border border-[#E8E3D8] px-3 py-3 text-sm"
                >
                  <option value="">Tous les types</option>
                  {typesBiens.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.nom}
                    </option>
                  ))}
                </select>
              </div>

              <div className="border-t border-[#E8E3D8] py-3">
                <p className="mb-2 text-sm font-medium text-[#0F1923]">
                  Chambres min.
                </p>
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
                  className="w-full rounded-lg border border-[#E8E3D8] px-3 py-3 text-sm"
                >
                  <option value="">Peu importe</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                </select>
              </div>

              <div className="border-t border-[#E8E3D8] py-3">
                <p className="mb-2 text-sm font-medium text-[#0F1923]">Tri</p>
                <select
                  value={draft.sort ?? 'recent'}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, sort: e.target.value }))
                  }
                  className="w-full rounded-lg border border-[#E8E3D8] px-3 py-3 text-sm"
                >
                  <option value="recent">Plus récents</option>
                  <option value="prix_asc">Prix croissant</option>
                  <option value="prix_desc">Prix décroissant</option>
                </select>
              </div>
            </div>

            <div
              className="flex gap-3 border-t border-[#E8E3D8] bg-white p-4"
              style={{
                paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
              }}
            >
              <button
                type="button"
                onClick={() => {
                  reinitialiser()
                }}
                className="flex-1 rounded-lg border border-[#E8E3D8] py-3 text-sm font-medium text-[#0F1923]"
              >
                Réinitialiser
              </button>
              <button
                type="button"
                onClick={appliquer}
                className="flex-1 rounded-lg bg-[#D97B00] py-3 text-sm font-medium text-white"
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
