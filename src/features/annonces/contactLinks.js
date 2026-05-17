import { formatWhatsApp } from './phoneWhatsApp'

function messageWhatsAppAnnonce(titre, annonceUrl) {
  return `Bonjour, je suis intéressé(e) par votre bien : ${titre}.

Voir l'annonce : ${annonceUrl}

Est-il toujours disponible ?`
}

function corpsMailAnnonce(titre, annonceUrl) {
  return `Bonjour,

Je suis intéressé(e) par votre annonce : ${titre}.
Lien : ${annonceUrl}

Pourriez-vous me donner plus d'informations ?

Cordialement,`
}

/** Lien wa.me avec message annonce (titre + URL publique). */
export function lienWhatsAppAnnonce(numero, titre, annonceUrl) {
  const tel = formatWhatsApp(numero)
  if (!tel || !annonceUrl?.trim()) return null
  const message = encodeURIComponent(messageWhatsAppAnnonce(titre, annonceUrl))
  return `https://wa.me/${tel.replace('+', '')}?text=${message}`
}

/** mailto: avec objet et corps pré-remplis pour une fiche annonce. */
export function lienMailtoAnnonce(email, titre, annonceUrl) {
  if (!email?.trim() || !annonceUrl?.trim()) return null
  const subject = `Demande concernant : ${titre}`
  const body = corpsMailAnnonce(titre, annonceUrl)
  return `mailto:${email.trim()}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
