import { notFound } from 'next/navigation'
import {
  getAnnonceBySlug,
  formatPrix,
  truncate,
} from '../../../features/annonces/annoncesService'
import { selectPrimaryPhoto } from '../../../features/annonces/selectPrimaryPhoto'
import Navbar from '../../../components/Navbar'
import Footer from '../../../components/Footer'
import GaleriePhotos from '../../../features/annonces/GaleriePhotos'
import BlocIdentite from '../../../features/annonces/BlocIdentite'
import BlocAgence from '../../../features/annonces/BlocAgence'
import BlocDescription from '../../../features/annonces/BlocDescription'
import BlocLocalisation from '../../../features/annonces/BlocLocalisation'

export const revalidate = 60

export async function generateMetadata({ params }) {
  const { slug } = await params
  const annonce = await getAnnonceBySlug(slug)

  if (!annonce) return { title: 'Annonce introuvable — ImmoCI' }

  const photoUrl = selectPrimaryPhoto(annonce.photos)
  const localisation =
    annonce.quartiers?.nom ?? annonce.villes?.nom ?? 'Abidjan'
  const prix = formatPrix(annonce.prix)

  return {
    title: `${annonce.titre} — ${prix} | ImmoCI`,
    description: truncate(
      `${annonce.types_biens?.nom ?? 'Bien'} à ${localisation}. ${annonce.description ?? ''}`,
      120
    ),
    openGraph: {
      title: annonce.titre,
      description: truncate(
        `${annonce.types_biens?.nom ?? 'Bien'} à ${localisation} — ${prix}`,
        120
      ),
      images: photoUrl ? [{ url: photoUrl }] : [],
      locale: 'fr_CI',
      type: 'website',
    },
  }
}

export default async function FicheAnnonce({ params }) {
  const { slug } = await params
  const annonce = await getAnnonceBySlug(slug)

  if (!annonce) notFound()

  const photosSorted = [...(annonce.photos ?? [])].sort(
    (a, b) => (a.ordre ?? 0) - (b.ordre ?? 0)
  )

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#FAF6EF] pb-28 md:pb-8">
        <GaleriePhotos photos={photosSorted} titre={annonce.titre} />

        <div className="mx-auto max-w-5xl px-4 py-8 md:px-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="space-y-8 md:col-span-2">
              <BlocIdentite annonce={annonce} />
              <BlocDescription annonce={annonce} />
              <BlocLocalisation annonce={annonce} />
            </div>

            <div className="md:col-span-1">
              <div className="md:sticky md:top-24">
                <BlocAgence
                  agence={annonce.agences}
                  titre={annonce.titre}
                  annonceId={annonce.id}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
