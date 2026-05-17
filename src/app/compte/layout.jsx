import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CompteNav from '@/features/compte/CompteNav'

export default function CompteLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-surface">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 md:flex-row md:px-6">
          <CompteNav />
          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </main>
      <Footer />
    </>
  )
}

