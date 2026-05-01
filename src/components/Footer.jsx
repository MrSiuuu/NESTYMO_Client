import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="overflow-x-hidden bg-[#1A1A2E] px-4 py-12 text-white md:px-6">
      <div className="mx-auto max-w-7xl">
        <p className="font-playfair text-2xl font-semibold text-[#D97B00]">
          ImmoCI
        </p>
        <nav className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-sm text-white/80">
          <Link href="/annonces" className="hover:text-white">
            Annonces
          </Link>
          <a href="#" className="hover:text-white">
            Agences
          </a>
          <a href="#" className="hover:text-white">
            Blog
          </a>
          <a href="#" className="hover:text-white">
            Contact
          </a>
        </nav>
        <p className="mt-8 text-center text-sm text-white/50">
          © 2026 ImmoCI — Tous droits réservés
        </p>
      </div>
    </footer>
  )
}
