
'use client';

import Link from 'next/link';
import { Sparkles, Menu } from 'lucide-react';
import { UserNav } from '@/components/layout/UserNav';
import { useUser } from '@/firebase';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export function Header() {
  const { user } = useUser();
  const [isSheetOpen, setSheetOpen] = useState(false);

  const closeSheet = () => setSheetOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <span className="font-bold font-headline text-lg">
            Cosmic Insights
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm flex-1">
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
          {user && (
            <Link
              href="#history"
              className="transition-colors hover:text-primary"
            >
              History
            </Link>
          )}
        </nav>
        <div className="flex flex-1 items-center justify-end md:hidden">
          <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="flex flex-col gap-6 pt-10">
                <Link href="/" className="flex items-center space-x-2" onClick={closeSheet}>
                  <Sparkles className="h-6 w-6 text-primary" />
                  <span className="font-bold">Cosmic Insights</span>
                </Link>
                <Link href="#horoscope" className="text-muted-foreground hover:text-primary" onClick={closeSheet}>
                  Personalized Horoscope
                </Link>
                <Link href="#compatibility" className="text-muted-foreground hover:text-primary" onClick={closeSheet}>
                  Compatibility
                </Link>
                <Link href="#birth-chart" className="text-muted-foreground hover:text-primary" onClick={closeSheet}>
                  Birth Chart
                </Link>
                {user && (
                  <Link href="#history" className="text-muted-foreground hover:text-primary" onClick={closeSheet}>
                    History
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
        <div className="hidden md:flex items-center justify-end">
          <UserNav />
        </div>
      </div>
    </header>
  );
}
