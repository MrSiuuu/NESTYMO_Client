'use client'

import { useState } from 'react'
import { insertContact } from '../contacts/contactsService'

export default function FormulaireContact({ annonceId, agenceId }) {
  const [nom, setNom] = useState('')
  const [telephone, setTelephone] = useState('')
  const [message, setMessage] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()

    if (honeypot) return

    if (!agenceId) {
      setError('Impossible d’envoyer : agence non disponible.')
      return
    }

    const chiffres = telephone.replace(/\D/g, '')
    if (chiffres.length < 8) {
      setError('Veuillez entrer un numéro de téléphone valide (min. 8 chiffres).')
      return
    }

    const lastContact = localStorage.getItem('immoci_last_contact')
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
      telephone,
      message,
    })

    setLoading(false)

    if (result.success) {
      localStorage.setItem('immoci_last_contact', Date.now().toString())
      setSuccess(true)
      setNom('')
      setTelephone('')
      setMessage('')
    } else {
      setError('Une erreur est survenue. Veuillez réessayer.')
    }
  }

  if (success) {
    return (
      <div className="py-4 text-center">
        <p className="mb-1 font-medium text-[#0F6E56]">✅ Demande envoyée</p>
        <p className="text-sm text-[#6B7280]">
          L&apos;agence vous contactera rapidement.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        style={{ display: 'none' }}
        aria-hidden="true"
      />

      <input
        type="text"
        placeholder="Votre nom"
        value={nom}
        onChange={(e) => setNom(e.target.value)}
        required
        className="mb-2 w-full rounded-lg border border-[#E8E3D8] px-3 py-2 text-sm focus:border-[#D97B00] focus:outline-none"
      />

      <input
        type="tel"
        placeholder="Votre téléphone *"
        value={telephone}
        onChange={(e) => setTelephone(e.target.value)}
        required
        className="mb-2 w-full rounded-lg border border-[#E8E3D8] px-3 py-2 text-sm focus:border-[#D97B00] focus:outline-none"
      />

      <textarea
        placeholder="Message (optionnel)"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={3}
        className="mb-3 w-full resize-none rounded-lg border border-[#E8E3D8] px-3 py-2 text-sm focus:border-[#D97B00] focus:outline-none"
      />

      {error ? (
        <p className="mb-2 text-xs text-[#C0392B]">{error}</p>
      ) : null}

      <button
        type="submit"
        disabled={loading || !agenceId}
        className="w-full rounded-lg bg-[#0F1923] py-2.5 text-sm font-medium text-white transition hover:bg-[#1a2d3d] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? 'Envoi en cours...' : 'Être rappelé(e)'}
      </button>
    </form>
  )
}
