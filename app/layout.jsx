import { Cinzel, Inter } from 'next/font/google';
import { LOCAL } from '@/lib/local';
import './globals.css';

const titulo = Cinzel({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--fuente-titulo',
  display: 'swap',
});

const texto = Inter({
  subsets: ['latin'],
  variable: '--fuente-texto',
  display: 'swap',
});

const descripcion =
  'Restaurante mágico en Zaragoza: clases de pociones con coctelería molecular, cerveza de mantequilla, chocolateadas, trivial y cumpleaños. Reserva tu mesa o tu clase.';

export const metadata = {
  metadataBase: new URL(LOCAL.web),
  title: 'El Caldero Mágico · Restaurante mágico y clases de pociones en Zaragoza',
  description: descripcion,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    siteName: LOCAL.nombre,
    title: 'El Caldero Mágico · Restaurante mágico en Zaragoza',
    description: descripcion,
    images: [{ url: '/og.jpg', width: 1200, height: 630, alt: 'El caldero de El Caldero Mágico' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'El Caldero Mágico · Restaurante mágico en Zaragoza',
    description: descripcion,
    images: ['/og.jpg'],
  },
};

export const viewport = {
  themeColor: '#07060a',
};

// Ficha del negocio para buscadores: es lo que alimenta el panel de Google
// con horario, dirección, teléfono y tipo de cocina.
const ficha = {
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  name: LOCAL.nombre,
  description: descripcion,
  url: LOCAL.web,
  telephone: '+34624226793',
  email: LOCAL.correo,
  image: `${LOCAL.web}/og.jpg`,
  priceRange: '€€',
  servesCuisine: ['Hamburguesas', 'Cócteles', 'Cocina temática'],
  acceptsReservations: true,
  address: {
    '@type': 'PostalAddress',
    streetAddress: LOCAL.calle,
    addressLocality: 'Zaragoza',
    postalCode: LOCAL.cp,
    addressCountry: 'ES',
  },
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Wednesday', 'Thursday'], opens: '18:00', closes: '00:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Friday', 'Saturday'], opens: '12:00', closes: '01:30' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Sunday', opens: '12:00', closes: '00:00' },
  ],
  sameAs: [LOCAL.instagram],
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${titulo.variable} ${texto.variable}`}>
      <body>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ficha) }} />
      </body>
    </html>
  );
}
