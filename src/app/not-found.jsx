import Link from 'next/link'
import Navbar from '../components/Navbar'

export default function NotFound() {
  return (
    <>
      <Navbar />
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#FAF6EF] px-6 text-center">
        <h1 className="mb-4 font-playfair text-6xl font-bold text-[#D97B00]">
          404
        </h1>
        <p className="mb-2 text-lg text-[#0F1923]">
          Cette annonce n&apos;existe pas ou n&apos;est plus disponible.
        </p>
        <p className="mb-8 text-sm text-[#6B7280]">
          Le bien a peut-être déjà été vendu ou loué.
        </p>
        <Link
          href="/"
          className="rounded-lg bg-[#D97B00] px-6 py-3 font-medium text-white transition hover:bg-[#b86a00]"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </>
  )
}
