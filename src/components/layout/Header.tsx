
'use client';

import Link from 'next/link';
import { Sparkles, Menu } from 'lucide-react';
import { UserNav } from '@/components/layout/UserNav';
import { useUser } from '@/firebase';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
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
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {user && (
            <Link
              href="/history"
              className="transition-colors hover:text-primary"
            >
              History
            </Link>
          )}
        </nav>
        <div className="flex flex-1 items-center justify-end gap-4">
          <div className="hidden md:flex">
            <UserNav />
          </div>
          <div className="flex md:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle className="sr-only">Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 pt-10">
                  <Link href="/" className="flex items-center space-x-2" onClick={closeSheet}>
                    <Sparkles className="h-6 w-6 text-primary" />
                    <span className="font-bold">Cosmic Insights</span>
                  </Link>
                  {user && (
                    <Link href="/history" className="text-muted-foreground hover:text-primary" onClick={closeSheet}>
                      History
                    </Link>
                  )}
                   <div className="absolute bottom-4 left-4">
                    <UserNav />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
