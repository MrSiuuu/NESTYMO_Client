import { BadgeCheck } from 'lucide-react'

/**
 * Icone verte seule — accessibilite via title et aria-label
 */
export default function BadgeVerifie({ size = 18, className = '' }) {
  return (
    <span
      title="Agence verifiee MCLU"
      aria-label="Agence verifiee MCLU"
      className={`inline-flex items-center ${className}`}
    >
      <BadgeCheck size={size} className="text-[#1FA866]" strokeWidth={2} />
    </span>
  )
}
