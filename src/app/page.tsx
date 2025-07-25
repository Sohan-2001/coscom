
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { horoscopeSigns } from '@/data/horoscopes';
import { ZodiacIcon } from '@/components/common/zodiac-icons';
import { useTranslation } from '@/context/language-context';
import Image from 'next/image';

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="w-full">
      <section className="text-center mb-16">
        <h1 className="font-headline text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-primary to-accent mb-4">
          {t('home.title')}
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          {t('home.subtitle')}
        </p>
        <div className="relative w-full aspect-[16/9] md:aspect-[16/7] mt-8">
            <Image
                src="https://sxldi6vsg8pc7vjq.public.blob.vercel-storage.com/Gemini_Generated_Image_j8tm9zj8tm9zj8tm.png"
                alt="Mystical astrology collage"
                fill
                className="rounded-lg shadow-xl object-cover"
                priority
            />
        </div>
      </section>

      <section>
        <h2 className="font-headline text-4xl text-center mb-8">{t('home.daily_horoscopes')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {horoscopeSigns.map((sign) => (
            <Card key={sign} className="bg-card/50 backdrop-blur-sm border-border/20 hover:border-accent/50 transition-colors duration-300">
              <CardHeader className="flex flex-row items-center gap-4">
                <ZodiacIcon sign={sign} className="w-10 h-10 text-accent" />
                <div>
                  <CardTitle className="font-headline text-2xl">{t(`horoscope.${sign}.sign`)}</CardTitle>
                  <p className="text-sm text-muted-foreground">{t(`horoscope.${sign}.dateRange`)}</p>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80">{t(`horoscope.${sign}.reading`)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
