
'use client';

import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import type { DestinyReadingOutput } from '@/ai/flows/destiny-reading-flow';


export default function HistoryPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const readingsQuery = useMemoFirebase(() => {
    if (user && firestore) {
      return query(
        collection(firestore, 'users', user.uid, 'readings'),
        orderBy('date', 'desc'),
        limit(10)
      );
    }
    return null;
  }, [user, firestore]);

  const { data: readings, isLoading, error } = useCollection(readingsQuery);

  const readingSections: (keyof DestinyReadingOutput)[] = [
    'foundationalOverview',
    'careerAndWealth',
    'healthAndVitality',
    'loveAndRelationships',
    'personalityAndInnerGrowth',
    'lifePathAndTimeline',
    'guidanceAndRemedies',
  ];

  const sectionTitles: Record<keyof DestinyReadingOutput, string> = {
    foundationalOverview: 'Foundational Overview',
    careerAndWealth: 'Career, Wealth, and Success',
    healthAndVitality: 'Health and Vitality',
    loveAndRelationships: 'Love and Relationships',
    personalityAndInnerGrowth: 'Personality and Inner Growth',
    lifePathAndTimeline: 'Life Path and Timeline Summary',
    guidanceAndRemedies: 'Guidance and Remedies',
  };


  if (isUserLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <p className="text-lg mb-4">You must be logged in to view your history.</p>
        <Button asChild>
          <Link href="/">Go to Homepage</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <section id="history" className="py-16 sm:py-24 bg-secondary/20">
          <div className="container max-w-4xl">
            <Button asChild variant="ghost" className="mb-8">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <div className="text-center">
              <h2 className="text-2xl font-headline font-bold text-white sm:text-3xl">
                Your Reading History
              </h2>
              <p className="mt-4 text-base text-gray-300 sm:text-lg">
                A log of your recent destiny readings.
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
                    Could not load your history. Please try again later.
                  </AlertDescription>
                </Alert>
              )}
              {!isLoading && !error && readings && readings.length === 0 && (
                <Card className="bg-card/50">
                  <CardContent className="p-6 text-center">
                    <p>You have no saved readings yet. Generate one to start your history!</p>
                  </CardContent>
                </Card>
              )}
              {readings?.map((reading) => (
                <Card key={reading.id} className="bg-card/50">
                  <CardHeader>
                    <CardTitle>Destiny Reading</CardTitle>
                    <CardDescription>
                      {reading.date?.toDate && format(reading.date.toDate(), 'MMMM d, yyyy - h:mm a')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                     {typeof reading.content === 'string' ? (
                        <p className="whitespace-pre-wrap font-body text-base text-gray-300">
                          {reading.content}
                        </p>
                      ) : (
                        <Accordion type="single" collapsible className="w-full">
                          {readingSections.map((sectionKey) => (
                            reading.content[sectionKey] && (
                              <AccordionItem value={sectionKey} key={sectionKey}>
                                <AccordionTrigger className="text-lg font-semibold text-primary">
                                  {sectionTitles[sectionKey]}
                                </AccordionTrigger>
                                <AccordionContent>
                                  <p className="whitespace-pre-wrap font-body text-base text-gray-300">
                                    {reading.content[sectionKey]}
                                  </p>
                                </AccordionContent>
                              </AccordionItem>
                            )
                          ))}
                        </Accordion>
                      )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
