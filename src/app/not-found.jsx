import Link from 'next/link'
import Navbar from '../components/Navbar'

export default function NotFound() {
  return (
    <>
      <Navbar />
      <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-6 text-center">
        <h1 className="mb-4 text-6xl font-bold text-primary">404</h1>
        <p className="mb-2 text-lg text-dark">Page introuvable.</p>
        <p className="mb-8 text-sm text-gray">
          Le contenu demande n&apos;existe pas ou n&apos;est plus disponible.
        </p>
        <Link
          href="/"
          className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover"
        >
          Retour a l&apos;accueil
        </Link>
      </div>
    </>
  )
}

