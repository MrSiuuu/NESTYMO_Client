import Image from 'next/image'
import { getLogoUrl, getInitiales } from '@/lib/agenceHelpers'

export default function AgenceAvatar({ agence, size = 48, className = '' }) {
  const logoUrl = getLogoUrl(agence)
  const initiales = getInitiales(agence?.nom)
  const radius = Math.round(size * 0.25)

  if (logoUrl) {
    return (
      <div
        className={`relative shrink-0 overflow-hidden bg-gray-100 ${className}`}
        style={{ width: size, height: size, borderRadius: radius }}
      >
        <Image
          src={logoUrl}
          alt={agence?.nom ?? 'Logo agence'}
          fill
          className="object-cover"
          sizes={`${size}px`}
        />
      </div>
    )
  }

  return (
    <div
      className={`flex shrink-0 items-center justify-center bg-gray-100 font-bold text-gray-700 ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        fontSize: Math.round(size * 0.3),
      }}
    >
      {initiales}
    </div>
  )
}
