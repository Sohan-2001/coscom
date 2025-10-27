
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function Hero() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-background');

  return (
    <section className="relative h-[calc(100vh-3.5rem)] w-full flex items-center justify-center text-center">
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          className="object-cover"
          data-ai-hint={heroImage.imageHint}
          priority
        />
      )}
      <div className="absolute inset-0 bg-background/70" />
      <div className="relative z-10 max-w-4xl px-4">
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-headline font-bold tracking-tight text-white whitespace-nowrap">
          Discover Your Cosmic Blueprint
        </h1>
        <p className="mt-6 text-sm sm:text-lg leading-8 text-gray-300 font-body max-w-2xl mx-auto">
          Unveil the secrets of the stars with personalized horoscopes,
          compatibility checks, and birth chart overviews. Your journey into
          astrology starts here.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-y-4 gap-x-6">
          <Button asChild size="lg">
            <Link href="#horoscope">Get Your Horoscope</Link>
          </Button>
          <Button asChild variant="ghost" size="lg" className="text-white">
            <Link href="#birth-chart">Explore Your Chart →</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
