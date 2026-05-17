'use client'

import { useCallback, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function ProfilForm({ userEmail, initialPrenom, initialNom }) {
  const [prenom, setPrenom] = useState(initialPrenom)
  const [nom, setNom] = useState(initialNom)
  const [msgProfil, setMsgProfil] = useState(null)
  const [errProfil, setErrProfil] = useState(null)
  const [loadProfil, setLoadProfil] = useState(false)

  const [emailNew, setEmailNew] = useState(userEmail ?? '')
  const [msgEmail, setMsgEmail] = useState(null)
  const [errEmail, setErrEmail] = useState(null)
  const [loadEmail, setLoadEmail] = useState(false)

  const [oldPass, setOldPass] = useState('')
  const [newPass, setNewPass] = useState('')
  const [newPass2, setNewPass2] = useState('')
  const [msgPass, setMsgPass] = useState(null)
  const [errPass, setErrPass] = useState(null)
  const [loadPass, setLoadPass] = useState(false)

  const saveProfil = useCallback(
    async (e) => {
      e.preventDefault()
      setErrProfil(null)
      setMsgProfil(null)
      setLoadProfil(true)
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        setErrProfil('Session expiree. Reconnectez-vous.')
        setLoadProfil(false)
        return
      }
      const { error: e1 } = await supabase
        .from('users')
        .update({ prenom: prenom.trim(), nom: nom.trim() })
        .eq('id', user.id)
      if (e1) {
        setErrProfil(e1.message)
        setLoadProfil(false)
        return
      }
      const { error: e2 } = await supabase.auth.updateUser({
        data: { prenom: prenom.trim(), nom: nom.trim() },
      })
      if (e2) {
        setErrProfil(e2.message)
        setLoadProfil(false)
        return
      }
      setMsgProfil('Profil enregistre.')
      setLoadProfil(false)
    },
    [nom, prenom]
  )

  const saveEmail = useCallback(
    async (e) => {
      e.preventDefault()
      setErrEmail(null)
      setMsgEmail(null)
      const next = emailNew.trim()
      if (!next || next === userEmail) {
        setErrEmail('Indiquez une nouvelle adresse email.')
        return
      }
      setLoadEmail(true)
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({ email: next })
      setLoadEmail(false)
      if (error) {
        setErrEmail(error.message)
        return
      }
      setMsgEmail('Verification : un email de confirmation vous a ete envoye.')
    },
    [emailNew, userEmail]
  )

  const savePassword = useCallback(
    async (e) => {
      e.preventDefault()
      setErrPass(null)
      setMsgPass(null)
      if (newPass.length < 6) {
        setErrPass('Le mot de passe doit contenir au moins 6 caracteres.')
        return
      }
      if (newPass !== newPass2) {
        setErrPass('Les mots de passe ne correspondent pas.')
        return
      }
      if (!userEmail) {
        setErrPass('Email du compte introuvable.')
        return
      }
      setLoadPass(true)
      const supabase = createClient()
      const { error: eSign } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password: oldPass,
      })
      if (eSign) {
        setErrPass('Ancien mot de passe incorrect.')
        setLoadPass(false)
        return
      }
      const { error: eUp } = await supabase.auth.updateUser({ password: newPass })
      setLoadPass(false)
      if (eUp) {
        setErrPass(eUp.message)
        return
      }
      setMsgPass('Mot de passe mis a jour.')
      setOldPass('')
      setNewPass('')
      setNewPass2('')
    },
    [newPass, newPass2, oldPass, userEmail]
  )

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-xl font-bold text-dark md:text-2xl">Mon profil</h1>
        <p className="mt-1 text-sm text-gray">Vos informations personnelles</p>
      </div>

      <section className="rounded-xl border border-border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-dark">Identite</h2>
        <form onSubmit={saveProfil} className="mt-4 space-y-4">
          <div>
            <label htmlFor="profil-prenom" className="mb-1 block text-sm font-medium text-dark">
              Prenom
            </label>
            <input
              id="profil-prenom"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label htmlFor="profil-nom" className="mb-1 block text-sm font-medium text-dark">
              Nom
            </label>
            <input
              id="profil-nom"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          {errProfil ? (
            <p className="text-sm text-red-600" role="alert">
              {errProfil}
            </p>
          ) : null}
          {msgProfil ? (
            <p className="text-sm text-emerald-700" role="status">
              {msgProfil}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={loadProfil}
            className="cursor-pointer rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50"
            style={{ backgroundColor: '#E02020' }}
          >
            {loadProfil ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </form>
      </section>

      <section className="rounded-xl border border-border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-dark">Adresse email</h2>
        <p className="mt-1 text-xs text-gray">Actuelle : {userEmail}</p>
        <form onSubmit={saveEmail} className="mt-4 space-y-4">
          <div>
            <label htmlFor="profil-email" className="mb-1 block text-sm font-medium text-dark">
              Nouvelle adresse email
            </label>
            <input
              id="profil-email"
              type="email"
              value={emailNew}
              onChange={(e) => setEmailNew(e.target.value)}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          {errEmail ? (
            <p className="text-sm text-red-600" role="alert">
              {errEmail}
            </p>
          ) : null}
          {msgEmail ? (
            <p className="text-sm text-emerald-700" role="status">
              {msgEmail}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={loadEmail}
            className="cursor-pointer rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50"
            style={{ backgroundColor: '#E02020' }}
          >
            {loadEmail ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </form>
      </section>

      <section className="rounded-xl border border-border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-dark">Mot de passe</h2>
        <form onSubmit={savePassword} className="mt-4 space-y-4">
          <div>
            <label htmlFor="profil-old-pass" className="mb-1 block text-sm font-medium text-dark">
              Ancien mot de passe
            </label>
            <input
              id="profil-old-pass"
              type="password"
              autoComplete="current-password"
              value={oldPass}
              onChange={(e) => setOldPass(e.target.value)}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label htmlFor="profil-new-pass" className="mb-1 block text-sm font-medium text-dark">
              Nouveau mot de passe
            </label>
            <input
              id="profil-new-pass"
              type="password"
              autoComplete="new-password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label htmlFor="profil-new-pass2" className="mb-1 block text-sm font-medium text-dark">
              Confirmation
            </label>
            <input
              id="profil-new-pass2"
              type="password"
              autoComplete="new-password"
              value={newPass2}
              onChange={(e) => setNewPass2(e.target.value)}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          {errPass ? (
            <p className="text-sm text-red-600" role="alert">
              {errPass}
            </p>
          ) : null}
          {msgPass ? (
            <p className="text-sm text-emerald-700" role="status">
              {msgPass}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={loadPass}
            className="cursor-pointer rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50"
            style={{ backgroundColor: '#E02020' }}
          >
            {loadPass ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </form>
      </section>
    </div>
  )
}

