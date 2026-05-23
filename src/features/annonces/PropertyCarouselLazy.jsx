'use client'

import dynamic from 'next/dynamic'

const PropertyCarousel = dynamic(() => import('./PropertyCarousel'), {
  ssr: false,
  loading: () => null,
})

export default function PropertyCarouselLazy(props) {
  return <PropertyCarousel {...props} />
}
