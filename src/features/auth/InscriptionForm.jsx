'use client'

import { useCallback, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

function isValidEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
}

export default function InscriptionForm() {
  const [prenom, setPrenom] = useState('')
  const [nom, setNom] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault()
      setError(null)
      if (!prenom.trim() || !nom.trim()) {
        setError('Prenom et nom sont requis.')
        return
      }
      if (!isValidEmail(email)) {
        setError('Adresse email invalide.')
        return
      }
      if (password.length < 6) {
        setError('Le mot de passe doit contenir au moins 6 caracteres.')
        return
      }
      if (password !== password2) {
        setError('Les mots de passe ne correspondent pas.')
        return
      }
      setLoading(true)
      const supabase = createClient()
      const { error: err } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            prenom: prenom.trim(),
            nom: nom.trim(),
          },
        },
      })
      setLoading(false)
      if (err) {
        setError(err.message)
        return
      }
      setSuccess(true)
    },
    [email, nom, password, password2, prenom]
  )

  if (success) {
    return (
      <div className="mx-auto w-full max-w-[440px] rounded-xl border border-border bg-white p-6 shadow-sm md:p-8">
        <Link href="/" className="block text-center text-2xl font-bold text-primary">
          Nestymo
        </Link>
        <p className="mt-8 text-center text-sm font-medium text-dark">
          Un email de confirmation vous a ete envoye. Verifiez votre boite mail.
        </p>
        <p className="mt-4 text-center text-sm">
          <Link href="/connexion" className="text-primary hover:underline">
            Retour a la connexion
          </Link>
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-[440px] rounded-xl border border-border bg-white p-6 shadow-sm md:p-8">
      <Link href="/" className="block text-center text-2xl font-bold text-primary">
        Nestymo
      </Link>
      <h1 className="mt-6 text-center text-xl font-semibold text-dark">Creer un compte</h1>
      <p className="mt-1 text-center text-sm text-gray">Rejoignez Nestymo gratuitement</p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="inscription-prenom" className="mb-1 block text-sm font-medium text-dark">
              Prenom
            </label>
            <input
              id="inscription-prenom"
              required
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              className="w-full rounded-lg border border-border px-3 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label htmlFor="inscription-nom" className="mb-1 block text-sm font-medium text-dark">
              Nom
            </label>
            <input
              id="inscription-nom"
              required
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="w-full rounded-lg border border-border px-3 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
        <div>
          <label htmlFor="inscription-email" className="mb-1 block text-sm font-medium text-dark">
            Email
          </label>
          <input
            id="inscription-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-border px-3 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div>
          <label htmlFor="inscription-password" className="mb-1 block text-sm font-medium text-dark">
            Mot de passe
          </label>
          <input
            id="inscription-password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-border px-3 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div>
          <label htmlFor="inscription-password2" className="mb-1 block text-sm font-medium text-dark">
            Confirmation mot de passe
          </label>
          <input
            id="inscription-password2"
            type="password"
            autoComplete="new-password"
            required
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            className="w-full rounded-lg border border-border px-3 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {error ? (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full cursor-pointer rounded-lg py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50"
          style={{ backgroundColor: '#E02020' }}
        >
          {loading ? 'Creation...' : 'Creer mon compte'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray">
        Deja un compte ?{' '}
        <Link href="/connexion" className="font-medium text-primary hover:underline">
          Se connecter
        </Link>
      </p>
    </div>
  )
}

