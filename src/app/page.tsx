
'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { PersonalizedHoroscope } from '@/components/sections/PersonalizedHoroscope';
import { ZodiacCompatibility } from '@/components/sections/ZodiacCompatibility';
import { BirthChart } from '@/components/sections/BirthChart';
import { useUser } from '@/firebase';
import { History } from '@/components/sections/History';

export default function Home() {
  const { user } = useUser();
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Hero />
        <PersonalizedHoroscope />
        <ZodiacCompatibility />
        <BirthChart />
        {user && <History />}
      </main>
      <Footer />
    </div>
  );
}
