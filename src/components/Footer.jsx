import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="overflow-x-hidden border-t border-border bg-dark px-4 py-12 text-white md:px-6">
      <div className="mx-auto max-w-7xl">
        <p className="text-2xl font-bold text-white">Nestymo</p>
        <nav className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-300">
          <Link href="/annonces" className="hover:text-white">
            Annonces
          </Link>
          <span className="text-gray-500">Agences</span>
          <span className="text-gray-500">Blog</span>
          <span className="text-gray-500">Contact</span>
          <a
            href="https://app.nestymo.ci"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 transition-colors hover:text-white"
          >
            Espace professionnel
          </a>
        </nav>
        <p className="mt-8 text-center text-sm text-gray-500">
          2026 Nestymo - Tous droits reserves
        </p>
      </div>
    </footer>
  )
}

