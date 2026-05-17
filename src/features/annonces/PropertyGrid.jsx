// Grille d'annonces — affiche les cards ou un message vide
import PropertyCard from './PropertyCard'

export default function PropertyGrid({ annonces, favoriIds = [] }) {
  const setFav = new Set(favoriIds)
  if (!annonces || annonces.length === 0) {
    return (
      <p className="py-16 text-center text-gray">
        Aucune annonce disponible pour le moment.
      </p>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
      {annonces.map((annonce, index) => (
        <PropertyCard
          key={annonce.id}
          annonce={annonce}
          priority={index === 0}
          initialFavori={setFav.has(annonce.id)}
        />
      ))}
    </div>
  )
}

