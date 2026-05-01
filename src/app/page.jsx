// Revalidation ISR : la page est regénérée toutes les 60 secondes
export const revalidate = 60

import { getAnnoncesPubliees } from '../features/annonces/annoncesService'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PropertyGrid from '../features/annonces/PropertyGrid'

export default async function HomePage() {
  const annonces = await getAnnoncesPubliees()

  return (
    <>
      <Navbar />

      {/* Hero section — statique pour cette mission */}
      <section className="bg-[#1A1A2E] py-20 px-6 text-center text-white">
        <h1 className="mb-4 font-playfair text-4xl font-bold md:text-5xl">
          Trouvez votre bien à Abidjan
        </h1>
        <p className="mx-auto mb-8 max-w-xl text-lg text-white/80">
          Des appartements, maisons et terrains dans tout le District d&apos;Abidjan
        </p>
        {/* CTA → /annonces (stub) */}
        <a
          href="/annonces"
          className="inline-block rounded-lg bg-[#D97B00] px-6 py-3 font-medium text-white transition hover:bg-[#b86a00]"
        >
          Voir toutes les annonces
        </a>
      </section>

      {/* Section annonces récentes */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="mb-8 font-playfair text-3xl font-semibold text-[#0F1923]">
          Annonces récentes
        </h2>
        <PropertyGrid annonces={annonces} />
      </section>

      {/* Strip stats — données statiques pour l'instant */}
      <section className="bg-[#1A1A2E] px-4 py-12 md:px-6">
        <div className="mx-auto grid max-w-4xl grid-cols-3 gap-4 text-center text-white md:gap-8">
          <div className="min-w-0 overflow-hidden">
            <p className="text-2xl font-bold text-[#D97B00] md:text-4xl">
              1 200+
            </p>
            <p className="mt-1 text-xs text-white/70 md:text-sm">
              Annonces publiées
            </p>
          </div>
          <div className="min-w-0 overflow-hidden">
            <p className="text-2xl font-bold text-[#D97B00] md:text-4xl">80+</p>
            <p className="mt-1 text-xs text-white/70 md:text-sm">
              Agences partenaires
            </p>
          </div>
          <div className="min-w-0 overflow-hidden">
            <p className="text-2xl font-bold text-[#D97B00] md:text-4xl">
              Abidjan
            </p>
            <p className="mt-1 text-xs text-white/70 md:text-sm">& District</p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
