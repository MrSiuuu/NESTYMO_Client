import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import { buildAnnoncePublicUrl } from '@/lib/siteUrl'
import {
  getAnnonceById,
  formatPrix,
  truncate,
} from '../../../features/annonces/annoncesService'
import { selectPrimaryPhoto } from '../../../features/annonces/selectPrimaryPhoto'
import Navbar from '../../../components/Navbar'
import Footer from '../../../components/Footer'
import { createClient } from '../../../lib/supabase/server'
import GaleriePhotos from '../../../features/annonces/GaleriePhotos'
import FicheBreadcrumb from '../../../features/annonces/FicheBreadcrumb'
import BlocIdentite from '../../../features/annonces/BlocIdentite'
import BlocDescription from '../../../features/annonces/BlocDescription'
import BlocLocalisation from '../../../features/annonces/BlocLocalisation'
import BlocAgence from '../../../features/annonces/BlocAgence'
import AgenceSummaryCard from '../../../features/annonces/AgenceSummaryCard'
import WhatsAppStickyBar from '../../../features/annonces/WhatsAppStickyBar'
import AnnonceViewTracker from '../../../features/tracking/AnnonceViewTracker'

export const revalidate = 60

export async function generateMetadata({ params }) {
  const { id } = await params
  const annonce = await getAnnonceById(id)

  if (!annonce) return { title: 'Annonce introuvable' }

  const photoUrl = selectPrimaryPhoto(annonce.photos)
  const localisation =
    annonce.quartiers?.nom ?? annonce.villes?.nom ?? "Cote d'Ivoire"
  const prix = formatPrix(annonce.prix)

  return {
    title: `${annonce.titre} - ${prix}`,
    description: truncate(
      `${annonce.types_biens?.nom ?? 'Bien'} a ${localisation}. ${annonce.description ?? ''}`,
      120
    ),
    openGraph: {
      title: annonce.titre,
      description: truncate(
        `${annonce.types_biens?.nom ?? 'Bien'} a ${localisation} - ${prix}`,
        120
      ),
      images: photoUrl ? [{ url: photoUrl }] : [],
      locale: 'fr_CI',
      type: 'website',
    },
  }
}

export default async function FicheAnnoncePage({ params }) {
  const { id } = await params
  const annonce = await getAnnonceById(id)

  if (!annonce) notFound()

  const headersList = await headers()
  const annonceUrl = buildAnnoncePublicUrl(annonce.id, headersList)

  const photosSorted = [...(annonce.photos ?? [])].sort(
    (a, b) => (a.ordre ?? 0) - (b.ordre ?? 0)
  )

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  let initialFavori = false
  if (user) {
    const { data: fav } = await supabase
      .from('favoris')
      .select('id')
      .eq('user_id', user.id)
      .eq('annonce_id', annonce.id)
      .maybeSingle()
    initialFavori = Boolean(fav)
  }

  return (
    <>
      <AnnonceViewTracker annonceId={annonce.id} />
      <Navbar />

      <main className="min-h-screen bg-white pb-28 md:pb-10">
        <div className="mx-auto max-w-7xl px-4 pt-4 md:px-6 md:pt-6">
          <FicheBreadcrumb annonce={annonce} />

          <section className="mt-4 grid grid-cols-1 items-start gap-8 md:grid-cols-[minmax(0,1.5fr)_380px]">
            <GaleriePhotos
              variant="fiche"
              photos={photosSorted}
              titre={annonce.titre}
              agenceNom={annonce.agences?.nom}
              annonceId={annonce.id}
              initialFavori={initialFavori}
            />
            <aside className="md:sticky md:top-[88px]">
              <BlocAgence
                variant="sidebar"
                agence={annonce.agences}
                titre={annonce.titre}
                annonceId={annonce.id}
                annonceUrl={annonceUrl}
              />
            </aside>
          </section>

          <div className="mt-10 space-y-10">
            <BlocIdentite annonce={annonce} />
            <BlocDescription annonce={annonce} />
            <BlocLocalisation annonce={annonce} />
            <AgenceSummaryCard agence={annonce.agences} />
          </div>
        </div>

        <WhatsAppStickyBar
          agence={annonce.agences}
          titre={annonce.titre}
          annonceId={annonce.id}
          annonceUrl={annonceUrl}
        />
      </main>

      <Footer />
    </>
  )
}
