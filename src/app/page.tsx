
'use client';

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-background');
  const router = useRouter();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    if (!isUserLoading && user) {
      router.replace('/start');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          className="object-cover z-0 opacity-20"
          data-ai-hint={heroImage.imageHint}
          priority
        />
      )}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-transparent to-background" />

      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 md:p-8">
        <header className="text-center">
          <h1 className="font-headline text-5xl sm:text-6xl md:text-7xl text-white tracking-wider drop-shadow-lg font-bold">
            Cosmic Compass
          </h1>
          <p className="font-body text-lg md:text-xl text-muted-foreground mt-4 max-w-2xl mx-auto">
            Unveil Your Destiny in the Stars and on Your Palms.
          </p>
        </header>

        <div className="mt-12">
          <Link href="/login" passHref>
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground text-xl px-12 py-8">
              Let's Start
            </Button>
          </Link>
        </div>

        <footer className="absolute bottom-0 w-full text-center pb-8">
          <p className="text-sm text-muted-foreground">
            Created with mystical energies and code.
          </p>
        </footer>
      </div>
    </main>
  );
}
