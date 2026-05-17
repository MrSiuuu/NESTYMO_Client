'use client'

import { useCallback, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function ReinitialisationForm() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault()
      setError(null)
      setMessage(null)
      setLoading(true)
      const supabase = createClient()
      const origin = typeof window !== 'undefined' ? window.location.origin : ''
      const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${origin}/connexion`,
      })
      setLoading(false)
      if (err) {
        setError(err.message)
        return
      }
      setMessage('Si un compte existe pour cet email, vous recevrez un lien de reinitialisation.')
    },
    [email]
  )

  return (
    <div className="mx-auto w-full max-w-[440px] rounded-xl border border-border bg-white p-6 shadow-sm md:p-8">
      <Link href="/" className="block text-center text-2xl font-bold text-primary">
        Nestymo
      </Link>
      <h1 className="mt-6 text-center text-xl font-semibold text-dark">Mot de passe oublie</h1>
      <p className="mt-1 text-center text-sm text-gray">Recevez un lien par email</p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div>
          <label htmlFor="reset-email" className="mb-1 block text-sm font-medium text-dark">
            Email
          </label>
          <input
            id="reset-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-border px-3 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        {error ? (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
            {error}
          </p>
        ) : null}
        {message ? (
          <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800" role="status">
            {message}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={loading}
          className="w-full cursor-pointer rounded-lg py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50"
          style={{ backgroundColor: '#E02020' }}
        >
          {loading ? 'Envoi...' : 'Envoyer le lien'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm">
        <Link href="/connexion" className="text-primary hover:underline">
          Retour a la connexion
        </Link>
      </p>
    </div>
  )
}

