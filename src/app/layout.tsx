import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Cosmic Compass',
  description: 'Unveil Your Destiny in the Stars and on Your Palms.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head />
      <body className={cn('font-body antialiased min-h-screen')}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
