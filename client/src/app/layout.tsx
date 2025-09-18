import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GymArt App',
  description:
    'Fullstack application with Express API, Next.js client, and PostgreSQL',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  );
}
