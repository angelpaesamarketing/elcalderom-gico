import { Cinzel, Inter } from 'next/font/google';
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

export const metadata = {
  title: 'El Caldero Mágico · Restaurante mágico en Zaragoza',
  description:
    'Restaurante de temática mágica en Zaragoza: clases de pociones, cerveza de mantequilla, cumpleaños y eventos.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${titulo.variable} ${texto.variable}`}>
      <body>{children}</body>
    </html>
  );
}
