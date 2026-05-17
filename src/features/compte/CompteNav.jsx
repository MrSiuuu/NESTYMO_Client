'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Heart, User } from 'lucide-react'

const links = [
  { href: '/compte/favoris', label: 'Mes favoris', Icon: Heart },
  { href: '/compte/profil', label: 'Mon profil', Icon: User },
]

export default function CompteNav() {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Espace compte"
      className="flex shrink-0 flex-row gap-2 overflow-x-auto border-b border-border pb-2 md:w-52 md:flex-col md:border-b-0 md:border-r md:pr-6 md:pb-0"
    >
      {links.map(({ href, label, Icon }) => {
        const actif = pathname === href
        return (
          <Link
            key={href}
            href={href}
            className={`flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-lg px-4 py-3 text-sm font-medium transition md:w-full ${
              actif
                ? 'bg-primary text-white'
                : 'text-dark hover:bg-gray-100'
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}

