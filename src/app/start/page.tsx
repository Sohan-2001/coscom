
'use client';
import Image from 'next/image';
import { CosmicForm } from '@/components/cosmic-form';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function StartPage() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-background');
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
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

      <div className="relative z-20 flex flex-col items-center p-4 sm:p-6 md:p-8">
        <header className="text-center my-8 sm:my-12">
          <h1 className="font-headline text-5xl sm:text-6xl md:text-7xl text-white tracking-wider drop-shadow-lg font-bold">
            Cosmic Compass
          </h1>
          <p className="font-body text-lg md:text-xl text-muted-foreground mt-4 max-w-2xl mx-auto">
            Unveil Your Destiny in the Stars and on Your Palms.
          </p>
        </header>

        <div className="w-full flex flex-col items-center gap-8">
            <CosmicForm />
        </div>

        <footer className="w-full text-center mt-16 sm:mt-24 pb-8">
          <p className="text-sm text-muted-foreground">
            Created with mystical energies and code.
          </p>
        </footer>
      </div>
    </main>
  );
}
