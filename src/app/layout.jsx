// Layout global — polices et metadata uniquement
import { Playfair_Display, DM_Sans } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-playfair-display',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-dm-sans',
})

export const metadata = {
  title: 'ImmoCI — Trouvez votre bien à Abidjan',
  description:
    "La marketplace immobilière de référence à Abidjan. Appartements, villas, terrains à louer ou à vendre dans tout le District d'Abidjan.",
  openGraph: {
    title: 'ImmoCI — Immobilier à Abidjan',
    description: 'Trouvez votre bien immobilier à Abidjan',
    locale: 'fr_CI',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="bg-[#FAF6EF] text-[#0F1923] font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
