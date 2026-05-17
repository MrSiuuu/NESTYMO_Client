'use client'

import { useCallback, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Heart } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useSessionContext } from '@/contexts/SessionContext'

const btnBase =
  'inline-flex cursor-pointer items-center justify-center rounded-full border border-border bg-white/95 p-2 shadow-sm transition hover:bg-white disabled:cursor-not-allowed'

export default function AnnonceFavoriButton({
  annonceId,
  initialFavori,
  variant = 'default',
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, loading } = useSessionContext()
  const [favori, setFavori] = useState(initialFavori)
  const [busy, setBusy] = useState(false)

  const redirectConnexion = useCallback(() => {
    const qs = typeof window !== 'undefined' ? window.location.search : ''
    const path =
      pathname && pathname.startsWith('/') ? `${pathname}${qs}` : `/annonces/${annonceId}`
    router.push(`/connexion?redirect=${encodeURIComponent(path)}`)
  }, [annonceId, pathname, router])

  const toggle = useCallback(
    async (e) => {
      e.preventDefault()
      e.stopPropagation()
      if (!user) {
        redirectConnexion()
        return
      }
      if (!annonceId || busy) return
      setBusy(true)
      const supabase = createClient()
      if (favori) {
        const { error } = await supabase
          .from('favoris')
          .delete()
          .eq('annonce_id', annonceId)
          .eq('user_id', user.id)
        if (!error) {
          setFavori(false)
          if (pathname?.startsWith('/compte/favoris')) router.refresh()
        }
      } else {
        const { error } = await supabase.from('favoris').insert({
          annonce_id: annonceId,
          user_id: user.id,
        })
        if (!error) {
          setFavori(true)
          if (pathname?.startsWith('/compte/favoris')) router.refresh()
        }
      }
      setBusy(false)
    },
    [annonceId, busy, favori, pathname, redirectConnexion, router, user]
  )

  const isOverlay = variant === 'overlay'

  return (
    <button
      type="button"
      onClick={(e) => void toggle(e)}
      disabled={loading || busy}
      aria-label={favori ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      aria-pressed={favori}
      className={
        isOverlay
          ? `${btnBase} ${favori ? 'text-primary' : 'text-gray'}`
          : `cursor-pointer rounded-full border border-border bg-white p-2 shadow-sm transition hover:border-primary disabled:cursor-not-allowed ${favori ? 'text-primary' : 'text-gray'}`
      }
    >
      <Heart
        className={`h-5 w-5 md:h-6 md:w-6 ${favori ? 'fill-current' : ''}`}
        aria-hidden
      />
    </button>
  )
}

