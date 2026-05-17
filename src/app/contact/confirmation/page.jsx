import Link from 'next/link'
import { Send } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { createClient } from '@/lib/supabase/server'

export const metadata = {
  title: 'Demande envoyee',
}

export default async function ContactConfirmationPage({ searchParams }) {
  const sp = await searchParams
  const rawAgence = typeof sp.agence === 'string' ? sp.agence : ''
  let agenceNom = ''
  try {
    agenceNom = rawAgence ? decodeURIComponent(rawAgence) : ''
  } catch {
    agenceNom = rawAgence
  }
  const annonceId = typeof sp.annonce === 'string' ? sp.annonce : ''
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const agenceLabel = agenceNom.trim() || "l'agence"

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-surface px-4 py-12 md:py-16">
        <div className="mx-auto max-w-lg rounded-xl border border-border bg-white p-8 text-center shadow-sm md:p-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
            <Send className="h-7 w-7" style={{ color: '#E02020' }} aria-hidden />
          </div>
          <h1 className="mt-6 text-2xl font-bold text-dark">Demande envoyee !</h1>
          <p className="mt-3 text-sm text-gray md:text-base">
            Votre demande a bien ete envoyee a {agenceLabel}. L&apos;agence vous contactera rapidement.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            {annonceId ? (
              <Link
                href={`/annonces/${annonceId}`}
                className="inline-flex justify-center rounded-lg px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                style={{ backgroundColor: '#E02020' }}
              >
                Retour a l&apos;annonce
              </Link>
            ) : null}
            <Link
              href="/annonces"
              className="inline-flex justify-center rounded-lg border border-border bg-white px-5 py-3 text-sm font-semibold text-dark transition hover:bg-gray-50"
            >
              Reprendre ma recherche
            </Link>
          </div>

          {!user ? (
            <div className="mt-10 border-t border-border pt-8 text-left">
              <h2 className="text-lg font-semibold text-dark">Creez un compte et gagnez du temps</h2>
              <p className="mt-2 text-sm text-gray">
                Sauvegardez vos annonces favorites, configurez des alertes et suivez vos demandes.
              </p>
              <Link
                href="/inscription"
                className="mt-4 inline-flex w-full justify-center rounded-lg py-3 text-sm font-semibold text-white transition hover:opacity-90 sm:w-auto sm:px-8"
                style={{ backgroundColor: '#E02020' }}
              >
                Creer mon compte
              </Link>
              <p className="mt-4 text-center text-sm text-gray">
                <Link href="/connexion" className="font-medium text-primary hover:underline">
                  Deja un compte ? Se connecter
                </Link>
              </p>
            </div>
          ) : null}
        </div>
      </main>
      <Footer />
    </>
  )
}

