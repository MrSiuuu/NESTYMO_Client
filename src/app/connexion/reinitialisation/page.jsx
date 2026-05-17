import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ReinitialisationForm from '@/features/auth/ReinitialisationForm'

export const metadata = {
  title: 'Reinitialisation du mot de passe',
}

export default function ReinitialisationPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-surface px-4 py-10">
        <ReinitialisationForm />
      </main>
      <Footer />
    </>
  )
}

