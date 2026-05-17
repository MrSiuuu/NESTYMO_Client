'use client'

import Link from 'next/link'
import { MessageCircle, Phone, Mail, MessageSquare } from 'lucide-react'
import FormulaireContact from './FormulaireContact'
import { lienMailtoAnnonce, lienWhatsAppAnnonce } from './contactLinks'
import { recordClicOnce } from '../tracking/clientTracking'
import { useSessionContext } from '@/contexts/SessionContext'
import AgenceAvatar from '@/components/AgenceAvatar'
import BadgeVerifie from '@/components/BadgeVerifie'

export default function BlocAgence({
  agence,
  titre,
  annonceId,
  annonceUrl,
  variant = 'default',
}) {
  const { user } = useSessionContext()
  const connecte = Boolean(user)
  const sidebar = variant === 'sidebar'

  const telPropre =
    agence?.show_phone !== false && agence?.telephone
      ? agence.telephone.replace(/\s/g, '')
      : ''
  const email =
    agence?.show_email !== false && agence?.email ? agence.email : null
  const verified = agence?.verification_status === 'verified'

  const whatsappUrl =
    agence?.show_whatsapp !== false && agence?.whatsapp && annonceUrl
      ? lienWhatsAppAnnonce(agence.whatsapp, titre, annonceUrl)
      : null
  const mailtoUrl =
    email && annonceUrl ? lienMailtoAnnonce(email, titre, annonceUrl) : null

  const cardClass = sidebar
    ? 'flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6'
    : 'space-y-4 rounded-xl border border-border bg-white p-5 shadow-sm'

  const redirectConnexion = `/connexion?redirect=${encodeURIComponent(`/annonces/${annonceId}`)}`

  return (
    <div className={cardClass}>
      {agence ? (
        <div className="flex items-center gap-3">
          <AgenceAvatar agence={agence} size={sidebar ? 52 : 48} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={`/agences/${agence.id}`}
                className="truncate text-lg font-semibold text-dark hover:underline"
              >
                {agence.nom}
              </Link>
              {verified ? <BadgeVerifie /> : null}
            </div>
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray">Agence non renseignee</p>
      )}

      <div id="contact-whatsapp-bloc" className="flex flex-col gap-2.5">
        {agence?.show_whatsapp !== false && whatsappUrl ? (
          connecte ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => void recordClicOnce(annonceId, 'whatsapp')}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#1FA866] py-3 text-sm font-semibold text-white transition hover:bg-[#178A53]"
            >
              <MessageCircle className="h-5 w-5 shrink-0" aria-hidden />
              Contacter sur WhatsApp
            </a>
          ) : (
            <Link
              href={redirectConnexion}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1FA866] py-3 text-sm font-semibold text-white transition hover:bg-[#178A53]"
            >
              <MessageCircle className="h-5 w-5 shrink-0" aria-hidden />
              Contacter sur WhatsApp
            </Link>
          )
        ) : null}

        {agence?.show_phone !== false && telPropre ? (
          connecte ? (
            <a
              href={`tel:${telPropre}`}
              onClick={() => void recordClicOnce(annonceId, 'telephone')}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-black py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              <Phone className="h-5 w-5 shrink-0" aria-hidden />
              {agence.telephone}
            </a>
          ) : (
            <Link
              href={redirectConnexion}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-black py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              <Phone className="h-5 w-5 shrink-0" aria-hidden />
              Afficher le numero
            </Link>
          )
        ) : null}

        <button
          type="button"
          disabled
          aria-disabled="true"
          aria-label="Envoyer un SMS — bientôt disponible"
          title="Bientôt disponible"
          className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-100 py-3 text-sm font-semibold text-gray-400"
        >
          <MessageSquare className="h-5 w-5 shrink-0 opacity-50" aria-hidden />
          <span className="flex min-w-0 flex-wrap items-center justify-center gap-x-2 gap-y-1">
            <span className="whitespace-nowrap">Envoyer un SMS</span>
            <span className="shrink-0 rounded-full bg-gray-200/80 px-2 py-0.5 text-[10px] font-semibold uppercase leading-tight tracking-wide text-gray-500 sm:text-xs">
              À venir
            </span>
          </span>
        </button>

        {email ? (
          connecte ? (
            <a
              href={mailtoUrl}
              className="flex items-center justify-center gap-2 py-1 text-sm font-medium text-dark hover:text-primary"
            >
              <Mail className="h-4 w-4 shrink-0" aria-hidden />
              {email}
            </a>
          ) : (
            <Link
              href={redirectConnexion}
              className="flex items-center justify-center gap-2 py-1 text-sm font-medium text-dark hover:text-primary"
            >
              <Mail className="h-4 w-4 shrink-0" aria-hidden />
              Voir l&apos;email
            </Link>
          )
        ) : null}
      </div>

      <div id="contact-rappel" className="border-t border-gray-100 pt-4">
        <p className="mb-3 text-sm font-semibold text-dark">
          Demander a etre rappele
        </p>
        <FormulaireContact
          annonceId={annonceId}
          agenceId={agence?.id ?? null}
          agenceNom={agence?.nom ?? ''}
        />
        <p className="mt-3 text-center text-xs text-gray-400">
          Reponse moyenne sous 4 h ouvrees
        </p>
      </div>
    </div>
  )
}
