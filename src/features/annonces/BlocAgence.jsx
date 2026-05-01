import Image from 'next/image'
import Link from 'next/link'
import FormulaireContact from './FormulaireContact'
import { lienWhatsApp } from './annoncesService'

function IconWhatsApp() {
  return (
    <svg
      className="h-6 w-6 shrink-0"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.883 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

export default function BlocAgence({ agence, titre, annonceId }) {
  const whatsappUrl = agence?.whatsapp ? lienWhatsApp(agence.whatsapp, titre) : null

  const initiales = agence?.nom
    ? agence.nom
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '?'

  return (
    <>
      <div className="space-y-4 rounded-xl bg-white p-5 shadow-sm">
        <span className="inline-block rounded-full bg-[#E1F5EE] px-2 py-1 text-xs font-medium text-[#0F6E56]">
          Agence partenaire
        </span>

        {agence ? (
          <Link
            href={`/agences/${agence.id}`}
            className="flex items-center gap-3 transition hover:opacity-80"
          >
            {agence.logo ? (
              <Image
                src={agence.logo}
                alt={agence.nom}
                width={48}
                height={48}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FAF6EF] text-sm font-medium text-[#D97B00]">
                {initiales}
              </div>
            )}
            <span className="font-playfair font-semibold text-[#0F1923]">
              {agence.nom}
            </span>
          </Link>
        ) : (
          <div className="flex items-center gap-3 opacity-50">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FAF6EF] text-sm text-[#6B7280]">
              ?
            </div>
            <span className="text-sm text-[#6B7280]">Agence non renseignée</span>
          </div>
        )}

        {agence?.telephone ? (
          <p className="text-sm text-[#6B7280]">{agence.telephone}</p>
        ) : null}

        {whatsappUrl ? (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#1D9E75] py-3 font-medium text-white transition hover:bg-[#178a64]"
          >
            <IconWhatsApp />
            Écrire à l&apos;agence sur WhatsApp
          </a>
        ) : (
          <button
            type="button"
            disabled
            className="w-full cursor-not-allowed rounded-lg bg-[#1D9E75] py-3 font-medium text-white opacity-40"
          >
            WhatsApp non disponible
          </button>
        )}

        <div className="border-t border-[#E8E3D8] pt-4">
          <p className="mb-3 text-sm text-[#6B7280]">
            Ou laissez votre numéro, l&apos;agence vous rappelle
          </p>
          <FormulaireContact
            annonceId={annonceId}
            agenceId={agence?.id ?? null}
          />
        </div>
      </div>

      {/* CTA WhatsApp dupliqué — mobile, fixe en bas (complément Mission 3) */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#E8E3D8] bg-white p-4 md:hidden"
        style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
      >
        {whatsappUrl ? (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#1D9E75] py-3 font-medium text-white"
          >
            <IconWhatsApp />
            Écrire à l&apos;agence sur WhatsApp
          </a>
        ) : (
          <button
            type="button"
            disabled
            className="w-full cursor-not-allowed rounded-lg bg-[#1D9E75] py-3 font-medium text-white opacity-40"
          >
            WhatsApp non disponible
          </button>
        )}
      </div>
    </>
  )
}
