'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [menuOuvert, setMenuOuvert] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-[#E8E3D8] bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 md:px-6 md:py-4">
        <Link
          href="/"
          className="shrink-0 whitespace-nowrap font-playfair text-xl font-semibold text-[#D97B00] md:text-2xl"
          onClick={() => setMenuOuvert(false)}
        >
          ImmoCI
        </Link>

        <div className="hidden flex-1 items-center justify-center gap-8 text-sm font-medium text-[#0F1923] md:flex">
          <Link href="/annonces" className="hover:text-[#D97B00]">
            Annonces
          </Link>
          <a href="#" className="hover:text-[#D97B00]">
            Agences
          </a>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <a
            href="https://app.immoci.ci"
            target="_blank"
            rel="noopener noreferrer"
            className="whitespace-nowrap rounded-lg bg-[#D97B00] px-3 py-1.5 text-sm font-medium text-white transition hover:bg-[#b86a00] md:px-4 md:py-2"
          >
            Espace pro
          </a>
          <button
            type="button"
            className="rounded-lg p-2 text-[#0F1923] md:hidden"
            aria-expanded={menuOuvert}
            aria-label="Ouvrir le menu"
            onClick={() => setMenuOuvert((o) => !o)}
          >
            ☰
          </button>
        </div>
      </nav>

      {menuOuvert ? (
        <div className="border-t border-[#E8E3D8] bg-white shadow-md md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 text-sm font-medium text-[#0F1923]">
            <Link
              href="/annonces"
              className="py-1 hover:text-[#D97B00]"
              onClick={() => setMenuOuvert(false)}
            >
              Annonces
            </Link>
            <a href="#" className="py-1 hover:text-[#D97B00]">
              Agences
            </a>
          </div>
        </div>
      ) : null}
    </header>
  )
}
