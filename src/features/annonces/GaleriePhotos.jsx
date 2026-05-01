'use client'

import { useCallback, useRef, useState } from 'react'
import Image from 'next/image'

const PLACEHOLDER = '/images/placeholder.jpg'

/** Même largeur max que le contenu de la fiche (grille BlocIdentite / agence) — pas full-bleed écran */
const GALERIE_CONTENEUR =
  'mx-auto w-full max-w-5xl px-4 pt-6 md:px-6 md:pt-8'

const CADRE_PHOTO =
  'galerie-photo-principale relative w-full overflow-hidden rounded-xl bg-[#E5E7EB]'

/** Largeur utile ~1024px max — cohérent avec le conteneur */
const SIZES_GALERIE =
  '(max-width: 1024px) calc(100vw - 2rem), min(1024px, 100vw - 3rem)'

export default function GaleriePhotos({ photos, titre }) {
  const list = photos ?? []
  const total = list.length
  const [index, setIndex] = useState(0)
  const touchStartRef = useRef(null)

  const altBase = titre ?? 'Annonce'

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

  if (total === 0) {
    return (
      <div className={GALERIE_CONTENEUR}>
        <div className={CADRE_PHOTO}>
          <Image
            src={PLACEHOLDER}
            alt={altBase}
            fill
            className="object-cover"
            priority
            sizes={SIZES_GALERIE}
          />
        </div>
      </div>
    )
  }

  if (total === 1) {
    const p = list[0]
    return (
      <div className={GALERIE_CONTENEUR}>
        <div className={CADRE_PHOTO}>
          <Image
            src={p.url}
            alt={altBase}
            fill
            className="object-cover"
            priority
            sizes={SIZES_GALERIE}
          />
        </div>
      </div>
    )
  }

  const imgSrc = list[index]?.url ?? PLACEHOLDER
  const thumbs = list.slice(0, 4)

  return (
    <div className={GALERIE_CONTENEUR}>
      <div className="w-full">
        <div
          className={CADRE_PHOTO}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <Image
            src={imgSrc}
            alt={altBase}
            fill
            className="object-cover"
            priority={index === 0}
            sizes={SIZES_GALERIE}
          />

          <button
            type="button"
            onClick={prev}
            aria-label="Photo précédente"
            className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Photo suivante"
            className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70"
          >
            ›
          </button>

          <span className="absolute right-3 top-3 rounded-full bg-black/50 px-2 py-1 text-xs text-white">
            {index + 1} / {total}
          </span>
        </div>

        <div className="flex gap-2 overflow-x-auto py-3">
          {thumbs.map((photo, i) => (
            <button
              key={`${photo.url}-${i}`}
              type="button"
              onClick={() => setIndex(i)}
              className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg"
              style={{
                border:
                  i === index ? '2px solid #D97B00' : '2px solid transparent',
              }}
              aria-label={`Afficher la photo ${i + 1}`}
            >
              <Image
                src={photo.url}
                alt=""
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
