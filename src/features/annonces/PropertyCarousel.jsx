'use client'

import useEmblaCarousel from 'embla-carousel-react'
import PropertyCard from './PropertyCard'

export default function PropertyCarousel({ annonces }) {
  const [emblaRef] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: true,
  })

  if (!annonces?.length) {
    return (
      <p className="py-16 text-center text-gray">
        Aucune annonce disponible pour le moment.
      </p>
    )
  }

  return (
    <div className="-mx-4 overflow-hidden px-4" ref={emblaRef}>
      <div className="flex gap-3">
        {annonces.map((annonce, index) => (
          <div
            key={annonce.id}
            className="w-[78vw] max-w-[300px] flex-none"
          >
            <PropertyCard annonce={annonce} priority={index === 0} />
          </div>
        ))}
      </div>
    </div>
  )
}
