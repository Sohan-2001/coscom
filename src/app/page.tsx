
'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { DestinyReading } from '@/components/sections/DestinyReading';
import { Hero } from '@/components/sections/Hero';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Hero />
        <DestinyReading />
      </main>
      <Footer />
    </div>
  );
}
