
'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { AppNav } from '@/components/app-nav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <>
      <AppNav />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <Card>
            <CardHeader>
                <CardTitle>Your Saved Readings</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">
                    Your saved readings will appear here.
                </p>
            </CardContent>
        </Card>
      </main>
    </>
  );
}
