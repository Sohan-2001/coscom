import Image from 'next/image';
import { CosmicForm } from '@/components/cosmic-form';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { StarIcon } from '@/components/icons/Star';

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-background');

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

      {/* Twinkling stars background */}
      <div className="absolute inset-0 z-0">
        {[...Array(50)].map((_, i) => {
          const style = {
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${Math.random() * 5 + 5}s`,
            transform: `scale(${Math.random() * 0.5 + 0.25})`,
          };
          return (
            <StarIcon
              key={i}
              className="absolute text-accent/50 animate-twinkle"
              style={style}
            />
          );
        })}
      </div>

      <div className="relative z-20 flex flex-col items-center p-4 sm:p-6 md:p-8">
        <header className="text-center my-8 sm:my-12 md:my-16 lg:my-24">
          <h1 className="font-headline text-5xl sm:text-6xl md:text-7xl text-white tracking-wider drop-shadow-lg">
            Cosmic Compass
          </h1>
          <p className="font-body text-lg md:text-xl text-muted-foreground mt-4 max-w-2xl mx-auto">
            Unveil Your Destiny in the Stars and on Your Palms.
          </p>
        </header>

        <CosmicForm />

        <footer className="w-full text-center mt-16 sm:mt-24 pb-8">
          <p className="text-sm text-muted-foreground">
            Created with mystical energies and code.
          </p>
        </footer>
      </div>
    </main>
  );
}

    