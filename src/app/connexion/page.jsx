import { Suspense } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ConnexionForm from '@/features/auth/ConnexionForm'

export const metadata = {
  title: 'Connexion',
}

export default function ConnexionPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-surface px-4 py-10">
        <Suspense
          fallback={
            <div className="mx-auto h-80 max-w-[440px] animate-pulse rounded-xl border border-border bg-white shadow-sm" />
          }
        >
          <ConnexionForm />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}

