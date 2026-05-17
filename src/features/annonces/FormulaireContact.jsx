'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { insertContact } from '../contacts/contactsService'
import { useSession } from '@/hooks/useSession'

export default function FormulaireContact({ annonceId, agenceId, agenceNom = '' }) {
  const router = useRouter()
  const { user } = useSession()
  const [nom, setNom] = useState('')
  const [email, setEmail] = useState('')
  const [telephone, setTelephone] = useState('')
  const [message, setMessage] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()

    if (honeypot) return

    if (!agenceId) {
      setError("Impossible d'envoyer : agence non disponible.")
      return
    }

    if (!email?.trim()) {
      setError("L'email est obligatoire.")
      return
    }

    const chiffres = telephone.replace(/\D/g, '')
    if (chiffres.length < 8) {
      setError('Numero de telephone invalide (min. 8 chiffres).')
      return
    }

    const lastContact = localStorage.getItem('nestymo_last_contact')
    if (lastContact && Date.now() - parseInt(lastContact, 10) < 30000) {
      setError('Veuillez patienter quelques secondes avant de renvoyer.')
      return
    }

    setLoading(true)
    setError(null)

    const result = await insertContact({
      annonce_id: annonceId,
      agence_id: agenceId,
      nom,
      email: email.trim(),
      telephone,
      message,
      source: 'formulaire',
      user_id: user?.id ?? null,
    })

    setLoading(false)

    if (result.success) {
      localStorage.setItem('nestymo_last_contact', Date.now().toString())
      const label = (agenceNom && agenceNom.trim()) || 'Agence'
      router.push(
        `/contact/confirmation?agence=${encodeURIComponent(label)}&annonce=${encodeURIComponent(annonceId)}`
      )
      return
    }

    setError('Une erreur est survenue. Veuillez reessayer.')
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        className="sr-only"
        aria-hidden
      />

      <input
        type="text"
        placeholder="Votre nom"
        value={nom}
        onChange={(e) => setNom(e.target.value)}
        required
        className="mb-2 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      />

      <input
        type="email"
        placeholder="Votre email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="mb-2 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      />

      <input
        type="tel"
        placeholder="Votre telephone"
        value={telephone}
        onChange={(e) => setTelephone(e.target.value)}
        required
        className="mb-2 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      />

      <textarea
        placeholder="Message (optionnel)"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={3}
        className="mb-3 w-full resize-none rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      />

      {error ? <p className="mb-2 text-xs text-primary">{error}</p> : null}

      <button
        type="submit"
        disabled={loading || !agenceId}
        className="w-full cursor-pointer rounded-lg bg-primary py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? 'Envoi...' : 'Etre rappele'}
      </button>
    </form>
  )
}

