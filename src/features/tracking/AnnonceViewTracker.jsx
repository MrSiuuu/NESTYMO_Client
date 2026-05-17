'use client'

import { useEffect } from 'react'
import { recordVueOnce } from './clientTracking'

export default function AnnonceViewTracker({ annonceId }) {
  useEffect(() => {
    void recordVueOnce(annonceId)
  }, [annonceId])
  return null
}

