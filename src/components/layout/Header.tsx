'use client';

import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <span className="font-bold font-headline text-lg">
            Cosmic Insights
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link
            href="#horoscope"
            className="transition-colors hover:text-primary"
          >
            Personalized Horoscope
          </Link>
          <Link
            href="#compatibility"
            className="transition-colors hover:text-primary"
          >
            Compatibility
          </Link>
          <Link
            href="#birth-chart"
            className="transition-colors hover:text-primary"
          >
            Birth Chart
          </Link>
        </nav>
      </div>
    </header>
  );
}
