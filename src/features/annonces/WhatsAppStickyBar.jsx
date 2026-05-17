'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { MessageCircle } from 'lucide-react'
import { lienWhatsAppAnnonce } from './contactLinks'
import { recordClicOnce } from '../tracking/clientTracking'
import { useSessionContext } from '@/contexts/SessionContext'

export default function WhatsAppStickyBar({
  agence,
  titre,
  annonceId,
  annonceUrl,
}) {
  const { user } = useSessionContext()
  const connecte = Boolean(user)
  const [visible, setVisible] = useState(true)

  const showWa =
    agence?.show_whatsapp !== false && Boolean(agence?.whatsapp)
  const waUrl =
    showWa && annonceUrl
      ? lienWhatsAppAnnonce(agence.whatsapp, titre, annonceUrl)
      : null

  useEffect(() => {
    const el = document.getElementById('contact-whatsapp-bloc')
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(!entry.isIntersecting)
      },
      { threshold: 0.15, rootMargin: '0px 0px -80px 0px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  if (!showWa || !waUrl) return null

  const redirectConnexion = `/connexion?redirect=${encodeURIComponent(`/annonces/${annonceId}`)}`

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 border-t border-gray-100 bg-white p-4 transition-transform duration-300 md:hidden ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
      style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
    >
      {connecte ? (
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => void recordClicOnce(annonceId, 'whatsapp')}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#1FA866] py-3.5 text-sm font-semibold text-white transition hover:bg-[#178A53]"
        >
          <MessageCircle className="h-5 w-5 shrink-0" aria-hidden />
          Contacter sur WhatsApp
        </a>
      ) : (
        <Link
          href={redirectConnexion}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1FA866] py-3.5 text-sm font-semibold text-white transition hover:bg-[#178A53]"
        >
          <MessageCircle className="h-5 w-5 shrink-0" aria-hidden />
          Contacter sur WhatsApp
        </Link>
      )}
    </div>
  )
}
