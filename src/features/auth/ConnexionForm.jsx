'use client'

import { useCallback, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function ConnexionForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault()
      setError(null)
      setLoading(true)
      const supabase = createClient()
      const { error: err } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })
      setLoading(false)
      if (err) {
        setError(err.message === 'Invalid login credentials' ? 'Email ou mot de passe incorrect.' : err.message)
        return
      }
      const safe =
        redirectTo.startsWith('/') && !redirectTo.startsWith('//')
          ? redirectTo
          : '/'
      router.replace(safe)
      router.refresh()
    },
    [email, password, redirectTo, router]
  )

  return (
    <div className="mx-auto w-full max-w-[440px] rounded-xl border border-border bg-white p-6 shadow-sm md:p-8">
      <Link href="/" className="block text-center text-2xl font-bold text-primary">
        Nestymo
      </Link>
      <h1 className="mt-6 text-center text-xl font-semibold text-dark">Bon retour !</h1>
      <p className="mt-1 text-center text-sm text-gray">Connectez-vous a votre compte</p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div>
          <label htmlFor="connexion-email" className="mb-1 block text-sm font-medium text-dark">
            Email
          </label>
          <input
            id="connexion-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-border px-3 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div>
          <label htmlFor="connexion-password" className="mb-1 block text-sm font-medium text-dark">
            Mot de passe
          </label>
          <input
            id="connexion-password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>

      <p className="mt-4 text-center text-sm">
        <Link href="/connexion/reinitialisation" className="text-gray underline hover:text-dark">
          Mot de passe oublie ?
        </Link>
      </p>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center" aria-hidden>
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase text-gray">
          <span className="bg-white px-2">ou</span>
        </div>
      </div>

      <p className="text-center text-sm text-gray">
        <Link href="/inscription" className="font-medium text-primary hover:underline">
          Creer un compte
        </Link>
      </p>
    </div>
  )
}

