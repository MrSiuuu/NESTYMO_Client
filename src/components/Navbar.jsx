'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, X, ChevronDown, Heart, User, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useSessionContext } from '@/contexts/SessionContext'

function initialesUser(user) {
  const p = user?.user_metadata?.prenom
  const n = user?.user_metadata?.nom
  if (p && n) return `${String(p)[0]}${String(n)[0]}`.toUpperCase()
  const email = user?.email
  if (email && email.length >= 2) return email.slice(0, 2).toUpperCase()
  return '?'
}

export default function Navbar({ activeLink }) {
  const router = useRouter()
  const { user, loading } = useSessionContext()
  const [menuOuvert, setMenuOuvert] = useState(false)
  const [compteOuvert, setCompteOuvert] = useState(false)
  const compteRef = useRef(null)

  useEffect(() => {
    if (!compteOuvert) return
    function onDocClick(e) {
      if (compteRef.current && !compteRef.current.contains(e.target)) {
        setCompteOuvert(false)
      }
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [compteOuvert])

  const deconnecter = useCallback(async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setCompteOuvert(false)
    setMenuOuvert(false)
    router.push('/')
    router.refresh()
  }, [router])

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 md:px-6 md:py-4">
        <Link
          href="/"
          className="shrink-0 whitespace-nowrap text-xl font-bold text-primary md:text-2xl"
          onClick={() => setMenuOuvert(false)}
        >
          Nestymo
        </Link>

        <div className="hidden flex-1 items-center justify-center gap-8 text-sm font-medium text-dark md:flex">
          <Link
            href="/annonces"
            className={
              activeLink === 'annonces'
                ? 'font-semibold text-primary'
                : 'hover:text-primary'
            }
          >
            Annonces
          </Link>
          <Link
            href="/agences"
            className={
              activeLink === 'agences'
                ? 'font-semibold text-primary'
                : 'hover:text-primary'
            }
          >
            Agences
          </Link>
        </div>

        <div className="flex shrink-0 items-center gap-2 md:gap-3">
          {!loading && user ? (
            <div className="relative hidden md:block" ref={compteRef}>
              <button
                type="button"
                onClick={() => setCompteOuvert((o) => !o)}
                className="flex cursor-pointer items-center gap-2 rounded-full border border-border py-1 pl-1 pr-3 text-sm font-medium text-dark transition hover:bg-gray-50"
                aria-expanded={compteOuvert}
                aria-haspopup="menu"
              >
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: '#E02020' }}
                >
                  {initialesUser(user)}
                </span>
                Mon compte
                <ChevronDown className="h-4 w-4 text-gray" aria-hidden />
              </button>
              {compteOuvert ? (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-52 rounded-xl border border-border bg-white py-1 shadow-lg"
                >
                  <Link
                    href="/compte/favoris"
                    role="menuitem"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-dark hover:bg-gray-50"
                    onClick={() => setCompteOuvert(false)}
                  >
                    <Heart className="h-4 w-4 text-primary" aria-hidden />
                    Mes favoris
                  </Link>
                  <Link
                    href="/compte/profil"
                    role="menuitem"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-dark hover:bg-gray-50"
                    onClick={() => setCompteOuvert(false)}
                  >
                    <User className="h-4 w-4 text-gray" aria-hidden />
                    Mon profil
                  </Link>
                  <button
                    type="button"
                    role="menuitem"
                    className="flex w-full cursor-pointer items-center gap-2 px-4 py-2.5 text-left text-sm text-dark hover:bg-gray-50"
                    onClick={() => void deconnecter()}
                  >
                    <LogOut className="h-4 w-4 text-gray" aria-hidden />
                    Se deconnecter
                  </button>
                </div>
              ) : null}
            </div>
          ) : !loading ? (
            <Link
              href="/connexion"
              className="hidden text-sm font-medium text-gray transition hover:text-dark md:inline"
            >
              Connexion
            </Link>
          ) : (
            <span className="hidden h-8 w-16 animate-pulse rounded bg-gray-100 md:inline-block" aria-hidden />
          )}

          <button
            type="button"
            className="cursor-pointer rounded-lg p-2 text-dark md:hidden"
            aria-expanded={menuOuvert}
            aria-label="Menu"
            onClick={() => setMenuOuvert((o) => !o)}
          >
            {menuOuvert ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {menuOuvert ? (
        <div className="border-t border-border bg-white shadow-md md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 text-sm font-medium text-dark">
            <Link
              href="/annonces"
              className="py-1 hover:text-primary"
              onClick={() => setMenuOuvert(false)}
            >
              Annonces
            </Link>
            <Link
              href="/agences"
              className={
                activeLink === 'agences'
                  ? 'py-1 font-semibold text-primary'
                  : 'py-1 hover:text-primary'
              }
              onClick={() => setMenuOuvert(false)}
            >
              Agences
            </Link>
            {!loading && user ? (
              <>
                <Link
                  href="/compte/favoris"
                  className="py-1 hover:text-primary"
                  onClick={() => setMenuOuvert(false)}
                >
                  Mes favoris
                </Link>
                <Link
                  href="/compte/profil"
                  className="py-1 hover:text-primary"
                  onClick={() => setMenuOuvert(false)}
                >
                  Mon profil
                </Link>
                <button
                  type="button"
                  className="cursor-pointer py-1 text-left text-dark hover:text-primary"
                  onClick={() => void deconnecter()}
                >
                  Se deconnecter
                </button>
              </>
            ) : !loading ? (
              <Link
                href="/connexion"
                className="py-1 hover:text-primary"
                onClick={() => setMenuOuvert(false)}
              >
                Connexion
              </Link>
            ) : null}
          </div>
        </div>
      ) : null}
    </header>
  )
}

