'use client'

import { useCallback, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronLeft, ChevronRight, LockKeyhole } from 'lucide-react'
import { useSessionContext } from '@/contexts/SessionContext'
import AnnonceFavoriButton from './AnnonceFavoriButton'

const PLACEHOLDER = '/images/placeholder.svg'
const PHOTOS_LIBRES = 2

const CADRE_PHOTO =
  'relative h-[320px] w-full overflow-hidden rounded-xl bg-gray-200 md:h-[460px]'

const CADRE_FICHE =
  'relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gray-200 md:aspect-[16/11]'

const SIZES_GALERIE =
  '(max-width: 768px) min(calc(100vw - 2rem), 720px), min(1216px, calc(100vw - 3rem))'

export default function GaleriePhotos({
  photos,
  titre,
  agenceNom,
  annonceId,
  initialFavori,
  variant = 'default',
}) {
  const { user } = useSessionContext()
  const pathname = usePathname()
  const estConnecte = Boolean(user)

  const embedded = variant === 'fiche'
  const cadreClass = embedded ? CADRE_FICHE : CADRE_PHOTO
  const list = photos ?? []
  const total = list.length
  const [index, setIndex] = useState(0)
  const touchStartRef = useRef(null)

  const totalFloutees = estConnecte
    ? 0
    : Math.max(0, total - PHOTOS_LIBRES)

  const altBase = titre ?? 'Annonce'
  const filigrane = agenceNom?.trim() || null
  const connexionHref = pathname
    ? `/connexion?redirect=${encodeURIComponent(pathname)}`
    : '/connexion'

  const prev = useCallback(() => {
    if (total <= 1) return
    setIndex((i) => (i - 1 + total) % total)
  }, [total])

  const next = useCallback(() => {
    if (total <= 1) return
    setIndex((i) => (i + 1) % total)
  }, [total])

  function onTouchStart(e) {
    touchStartRef.current = e.touches[0].clientX
  }

  function onTouchEnd(e) {
    if (touchStartRef.current === null || total <= 1) return
    const endX = e.changedTouches[0].clientX
    const delta = touchStartRef.current - endX
    if (delta > 50) next()
    if (delta < -50) prev()
    touchStartRef.current = null
  }

  const wrapClass = embedded
    ? 'w-full'
    : 'mx-auto w-full max-w-7xl px-4 md:px-6'

  const navBtnClass = embedded
    ? 'absolute top-1/2 z-[2] flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/95 text-dark shadow-md transition hover:bg-white'
    : 'absolute top-1/2 z-[2] flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70'

  function renderPhoto(photo, options = {}) {
    const { priority = false } = options
    const src = photo?.url ?? PLACEHOLDER
    const photoVerrouillee = !estConnecte && index >= PHOTOS_LIBRES && total > PHOTOS_LIBRES

    if (photoVerrouillee) {
      return (
        <div className="relative h-full w-full">
          <Image
            src={src}
            alt=""
            fill
            className="scale-110 object-cover opacity-60 blur-xl"
            sizes={SIZES_GALERIE}
            aria-hidden
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/40 px-6 text-center text-white">
            <LockKeyhole size={32} aria-hidden />
            <p className="text-base font-semibold leading-tight">
              Connectez-vous pour voir
              <br />
              toutes les photos
            </p>
            <Link
              href={connexionHref}
              className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full bg-[#E02020] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#C01818]"
            >
              Se connecter
            </Link>
            {totalFloutees > 0 ? (
              <p className="text-xs text-white/70">
                {totalFloutees} photo{totalFloutees > 1 ? 's' : ''} masquee
                {totalFloutees > 1 ? 's' : ''}
              </p>
            ) : null}
          </div>
        </div>
      )
    }

    return (
      <Image
        src={src}
        alt={altBase}
        fill
        className="object-cover object-center"
        priority={priority}
        sizes={SIZES_GALERIE}
      />
    )
  }

  function cadreContenu(imageNode, avecNavigation) {
    return (
      <div className={cadreClass}>
        {imageNode}
        {filigrane ? (
          <div
            className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center"
            aria-hidden
          >
            <span className="max-w-[90%] select-none text-center text-2xl font-bold uppercase tracking-wide text-white/30 md:text-4xl">
              {filigrane}
            </span>
          </div>
        ) : null}
        {annonceId ? (
          <div className="absolute right-3 top-3 z-[2]">
            <AnnonceFavoriButton
              annonceId={annonceId}
              initialFavori={Boolean(initialFavori)}
              variant="overlay"
            />
          </div>
        ) : null}
        {avecNavigation ? (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Photo precedente"
              className={`left-3 ${navBtnClass}`}
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Photo suivante"
              className={`right-3 ${navBtnClass}`}
            >
              <ChevronRight className="h-6 w-6" />
            </button>
            <span
              className={`absolute z-[2] rounded-full px-2.5 py-1 text-xs font-medium ${
                embedded
                  ? 'bottom-3 right-3 bg-black/60 text-white'
                  : 'bottom-3 left-3 bg-black/50 text-white md:bottom-auto md:left-auto md:right-3 md:top-14'
              }`}
            >
              {index + 1} / {total}
            </span>
          </>
        ) : null}
      </div>
    )
  }

  if (total === 0) {
    return (
      <div className={wrapClass}>
        {cadreContenu(
          <Image
            src={PLACEHOLDER}
            alt={altBase}
            fill
            className="object-cover object-center"
            priority
            sizes={SIZES_GALERIE}
          />,
          false
        )}
      </div>
    )
  }

  if (total === 1) {
    return (
      <div className={wrapClass}>
        {cadreContenu(renderPhoto(list[0], { priority: true }), false)}
      </div>
    )
  }

  const thumbs = list.slice(0, 4)

  return (
    <div className={wrapClass}>
      <div className="w-full">
        <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          {cadreContenu(
            renderPhoto(list[index], { priority: index === 0 }),
            true
          )}
        </div>

        <div
          className={
            embedded
              ? 'mt-2 hidden gap-2 md:grid md:grid-cols-5'
              : 'flex gap-2 overflow-x-auto py-3'
          }
        >
          {thumbs.map((photo, i) => (
            <button
              key={`${photo.url}-${i}`}
              type="button"
              onClick={() => setIndex(i)}
              className={`relative shrink-0 cursor-pointer overflow-hidden border-2 ${
                embedded
                  ? `aspect-[4/3] w-full rounded-lg ${i === index ? 'border-black' : 'border-transparent'}`
                  : `h-[60px] w-20 rounded-lg ${i === index ? 'border-primary' : 'border-transparent'}`
              }`}
              aria-label={`Photo ${i + 1}`}
            >
              <Image
                src={photo.url}
                alt=""
                fill
                loading="lazy"
                fetchPriority="low"
                className="object-cover object-center"
                sizes="80px"
              />
              {!estConnecte && i >= PHOTOS_LIBRES && total > PHOTOS_LIBRES ? (
                <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/40">
                  <LockKeyhole size={14} className="text-white" aria-hidden />
                </div>
              ) : null}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
