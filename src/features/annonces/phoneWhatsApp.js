/** Utilitaires numeros - sans import serveur (utilisable cote client). */

export function formatWhatsApp(numero) {
  if (!numero) return null
  const clean = numero.replace(/[^\d+]/g, '')
  if (clean.startsWith('+225')) return clean
  if (clean.startsWith('00')) return '+' + clean.slice(2)
  if (clean.startsWith('225')) return '+' + clean
  if (clean.startsWith('0')) return '+225' + clean.slice(1)
  return '+225' + clean
}

export function lienWhatsApp(numero, titre) {
  const tel = formatWhatsApp(numero)
  if (!tel) return null
  const message = encodeURIComponent(
    `Bonjour, je suis interesse(e) par votre bien : ${titre}. Est-il toujours disponible ?`
  )
  return `https://wa.me/${tel.replace('+', '')}?text=${message}`
}
