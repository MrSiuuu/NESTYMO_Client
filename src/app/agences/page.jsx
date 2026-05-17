export const revalidate = 60

import { getAgencesPubliques } from '@/features/agences/agencesService'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AgencesListing from '@/features/agences/AgencesListing'

export const metadata = {
  title: 'Agences immobilieres',
  description:
    'Annuaire des agences immobilieres certifiees MCLU a Abidjan et en Cote d\'Ivoire.',
}

export default async function AgencesPage() {
  const agences = await getAgencesPubliques()

  return (
    <>
      <Navbar activeLink="agences" />

      <main className="min-h-screen bg-white">
        <section className="border-b border-gray-100 py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">
              Annuaire
            </span>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-dark md:text-5xl">
              Agences immobilieres d&apos;Abidjan
            </h1>
            <p className="mt-4 max-w-2xl text-base text-gray-600 md:text-lg">
              {agences.length} agence{agences.length > 1 ? 's' : ''} certifiee
              {agences.length > 1 ? 's' : ''} MCLU, verifiees a l&apos;inscription.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-12">
          <AgencesListing agences={agences} />
        </section>
      </main>

      <Footer />
    </>
  )
}
