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

function buildAnnoncesUrl(sp, pageNum) {
  const base = spVersObjet(sp)
  delete base.page
  const p = new URLSearchParams()
  Object.entries(base).forEach(([k, v]) => {
    if (v === null || v === undefined || v === '') return
    p.set(k, String(v))
  })
  if (pageNum > 1) p.set('page', String(pageNum))
  const qs = p.toString()
  return qs ? `/annonces?${qs}` : '/annonces'
}

/** Pagination page agence : /agences/[id]?page= */
function buildAgenceUrl(agenceId, sp, pageNum) {
  const base = spVersObjet(sp)
  delete base.page
  const p = new URLSearchParams()
  Object.entries(base).forEach(([k, v]) => {
    if (v === null || v === undefined || v === '') return
    p.set(k, String(v))
  })
  if (pageNum > 1) p.set('page', String(pageNum))
  const qs = p.toString()
  return qs ? `/agences/${agenceId}?${qs}` : `/agences/${agenceId}`
}

function buildUrl(sp, pageNum, variant, agenceId) {
  if (variant === 'agence' && agenceId) {
    return buildAgenceUrl(agenceId, sp, pageNum)
  }
  return buildAnnoncesUrl(sp, pageNum)
}

/** Numéros + ellipses pour la pagination desktop */
function numerosPages(page, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }
  const set = new Set([1, totalPages, page, page - 1, page + 1])
  const arr = [...set].filter((n) => n >= 1 && n <= totalPages).sort((a, b) => a - b)
  const out = []
  for (let i = 0; i < arr.length; i++) {
    if (i > 0 && arr[i] - arr[i - 1] > 1) out.push('ellipsis')
    out.push(arr[i])
  }
  return out
}

export default function Pagination({
  page,
  totalPages,
  searchParams,
  variant = 'annonces',
  agenceId,
}) {
  const sp = searchParams
  if (totalPages <= 1) return null

  const prevHref = buildUrl(sp, page - 1, variant, agenceId)
  const nextHref = buildUrl(sp, page + 1, variant, agenceId)
  const items = numerosPages(page, totalPages)

  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      <div className="flex items-center gap-3 md:hidden">
        {page <= 1 ? (
          <span className="cursor-not-allowed rounded-lg px-3 py-2 text-sm opacity-50">
            ← Précédent
          </span>
        ) : (
          <Link
            href={prevHref}
            className="rounded-lg px-3 py-2 text-sm text-[#0F1923] hover:bg-[#E8E3D8]"
          >
            ← Précédent
          </Link>
        )}
        <span className="text-sm text-[#6B7280]">
          Page {page} / {totalPages}
        </span>
        {page >= totalPages ? (
          <span className="cursor-not-allowed rounded-lg px-3 py-2 text-sm opacity-50">
            Suivant →
          </span>
        ) : (
          <Link
            href={nextHref}
            className="rounded-lg px-3 py-2 text-sm text-[#0F1923] hover:bg-[#E8E3D8]"
          >
            Suivant →
          </Link>
        )}
      </div>

      <div className="hidden items-center gap-1 md:flex">
        {page <= 1 ? (
          <span className="cursor-not-allowed rounded-lg px-3 py-2 text-sm opacity-50">
            ← Précédent
          </span>
        ) : (
          <Link
            href={prevHref}
            className="rounded-lg px-3 py-2 text-sm text-[#0F1923] hover:bg-[#E8E3D8]"
          >
            ← Précédent
          </Link>
        )}

        {items.map((item, i) =>
          item === 'ellipsis' ? (
            <span key={`e-${i}`} className="px-2 text-[#6B7280]">
              …
            </span>
          ) : (
            <Link
              key={`p-${item}-${i}`}
              href={buildUrl(sp, item, variant, agenceId)}
              className={`min-w-[2.25rem] rounded-lg px-3 py-2 text-center text-sm ${
                item === page
                  ? 'bg-[#D97B00] font-medium text-white'
                  : 'text-[#0F1923] hover:bg-[#E8E3D8]'
              }`}
            >
              {item}
            </Link>
          )
        )}

        {page >= totalPages ? (
          <span className="cursor-not-allowed rounded-lg px-3 py-2 text-sm opacity-50">
            Suivant →
          </span>
        ) : (
          <Link
            href={nextHref}
            className="rounded-lg px-3 py-2 text-sm text-[#0F1923] hover:bg-[#E8E3D8]"
          >
            Suivant →
          </Link>
        )}
      </div>
    </div>
  )
}
