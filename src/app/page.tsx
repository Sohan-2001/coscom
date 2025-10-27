
'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { PersonalizedHoroscope } from '@/components/sections/PersonalizedHoroscope';
import { ZodiacCompatibility } from '@/components/sections/ZodiacCompatibility';
import { BirthChart } from '@/components/sections/BirthChart';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Hero />
        <PersonalizedHoroscope />
        <ZodiacCompatibility />
        <BirthChart />
      </main>
      <Footer />
    </div>
  );
}
