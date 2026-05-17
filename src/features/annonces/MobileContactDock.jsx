'use client'

import Link from 'next/link'
import { Phone, MessageCircle, Mail } from 'lucide-react'
import { lienWhatsApp } from './phoneWhatsApp'
import { recordClicOnce } from '../tracking/clientTracking'
import { useSessionContext } from '@/contexts/SessionContext'

export default function MobileContactDock({ agence, titre, annonceId }) {
  const { user } = useSessionContext()
  const connecte = Boolean(user)

  if (!agence) return null

  const showWa = agence.show_whatsapp !== false && agence.whatsapp
  const showTel = agence.show_phone !== false && agence.telephone
  const waUrl = showWa ? lienWhatsApp(agence.whatsapp, titre) : null
  const tel = agence.telephone?.replace(/\s/g, '') ?? ''

  function scrollToForm() {
    const el = document.getElementById('contact-rappel')
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const redirectConnexion = `/connexion?redirect=${encodeURIComponent(`/annonces/${annonceId}`)}`

  const count = [showWa && waUrl, showTel && tel].filter(Boolean).length
  if (count === 0) {
    return (
      <div
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-white p-3 lg:hidden"
        style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
      >
        <button
          type="button"
          onClick={scrollToForm}
          className="w-full cursor-pointer rounded-lg bg-primary py-3 text-sm font-semibold text-white"
        >
          Contacter
        </button>
      </div>
    )
  }

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 flex gap-2 border-t border-border bg-white p-3 lg:hidden"
      style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
    >
      {showWa && waUrl ? (
        connecte ? (
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => void recordClicOnce(annonceId, 'whatsapp')}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 py-3 text-sm font-semibold text-white"
          >
            <MessageCircle className="h-4 w-4 shrink-0" aria-hidden />
            WhatsApp
          </a>
        ) : (
          <Link
            href={redirectConnexion}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 py-3 text-sm font-semibold text-white"
          >
            <MessageCircle className="h-4 w-4 shrink-0" aria-hidden />
            WhatsApp
          </Link>
        )
      ) : null}
      {showTel && tel ? (
        connecte ? (
          <a
            href={`tel:${tel}`}
            onClick={() => void recordClicOnce(annonceId, 'telephone')}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gray-200 py-3 text-sm font-semibold text-dark"
          >
            <Phone className="h-4 w-4 shrink-0" aria-hidden />
            Appeler
          </a>
        ) : (
          <Link
            href={redirectConnexion}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gray-200 py-3 text-sm font-semibold text-dark"
          >
            <Phone className="h-4 w-4 shrink-0" aria-hidden />
            Voir le numero
          </Link>
        )
      ) : null}
      <button
        type="button"
        onClick={scrollToForm}
        className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-semibold text-white"
      >
        <Mail className="h-4 w-4 shrink-0" aria-hidden />
        Contacter
      </button>
    </div>
  )
}

