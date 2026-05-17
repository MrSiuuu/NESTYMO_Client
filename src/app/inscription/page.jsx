import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import InscriptionForm from '@/features/auth/InscriptionForm'

export const metadata = {
  title: 'Inscription',
}

export default function InscriptionPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-surface px-4 py-10">
        <InscriptionForm />
      </main>
      <Footer />
    </>
  )
}

