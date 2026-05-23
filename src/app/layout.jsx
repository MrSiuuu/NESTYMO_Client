import { Inter } from 'next/font/google'
import './globals.css'
import { SessionProvider } from '@/contexts/SessionContext'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-inter',
})

export const metadata = {
  metadataBase: new URL('https://nestymo.ci'),
  title: {
    default: 'Nestymo - Immobilier en Cote d\'Ivoire',
    template: '%s | Nestymo',
  },
  description:
    'Trouvez appartements, villas et terrains a louer ou a vendre en Cote d\'Ivoire. Annonces d\'agences partenaires.',
  openGraph: {
    title: 'Nestymo',
    description: 'La plateforme immobiliere en Cote d\'Ivoire',
    locale: 'fr_CI',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="bg-surface text-dark font-sans antialiased">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}

