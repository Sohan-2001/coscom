
'use client';

import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { format } from 'date-fns';

export function History() {
  const { user } = useUser();
  const firestore = useFirestore();

  const horoscopesQuery = useMemoFirebase(() => {
    if (user && firestore) {
      return query(
        collection(firestore, 'users', user.uid, 'horoscopes'),
        orderBy('date', 'desc'),
        limit(10)
      );
    }
    return null;
  }, [user, firestore]);

  const { data: horoscopes, isLoading, error } = useCollection(horoscopesQuery);

  return (
    <section id="history" className="py-16 sm:py-24 bg-secondary/20">
      <div className="container max-w-4xl">
        <div className="text-center">
          <h2 className="text-3xl font-headline font-bold text-white sm:text-4xl">
            Your Horoscope History
          </h2>
          <p className="mt-4 text-lg text-gray-300">
            A log of your recent cosmic forecasts.
          </p>
        </div>

        <div className="mt-10 space-y-6">
          {isLoading && (
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          )}
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Could not load your horoscope history. Please try again later.
              </AlertDescription>
            </Alert>
          )}
          {!isLoading && !error && horoscopes && horoscopes.length === 0 && (
            <Card className="bg-card/50">
              <CardContent className="p-6 text-center">
                <p>You have no saved horoscopes yet. Generate one above to start your history!</p>
              </CardContent>
            </Card>
          )}
          {horoscopes?.map((horoscope) => (
            <Card key={horoscope.id} className="bg-card/50">
              <CardHeader>
                <CardTitle>{horoscope.zodiacSign} Horoscope</CardTitle>
                <CardDescription>
                  {horoscope.date?.toDate && format(horoscope.date.toDate(), 'MMMM d, yyyy - h:mm a')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap font-body text-base text-gray-300">
                  {horoscope.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
