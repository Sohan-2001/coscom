
'use client';

import { useUser, useCollection, useMemoFirebase, type WithId } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { AppNav } from '@/components/app-nav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { getFirestore, collection, query, orderBy } from 'firebase/firestore';
import type { Reading } from '@/lib/types';
import { format } from 'date-fns';

function ReadingDetails({ reading }: { reading: WithId<Reading> }) {
    const readingSections = [
        { title: 'Foundational Overview', content: reading.foundationalOverview },
        { title: 'Career, Wealth & Success', content: reading.careerWealthSuccess },
        { title: 'Health & Vitality', content: reading.healthVitality },
        { title: 'Love & Relationships', content: reading.loveRelationships },
        { title: 'Personality & Inner Growth', content: reading.personalityInnerGrowth },
        { title: 'Life Path & Timeline Summary', content: reading.lifePathTimeline },
        { title: 'Guidance & Remedies', content: reading.guidanceRemedies },
      ];

  return (
    <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
      {readingSections.map((section, index) => (
        section.content && <AccordionItem key={index} value={`item-${index}`}>
          <AccordionTrigger className="font-headline text-xl">{section.title}</AccordionTrigger>
          <AccordionContent>
            <div className="prose prose-lg dark:prose-invert font-body whitespace-pre-wrap leading-relaxed">
              {section.content}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}


export default function HistoryPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = getFirestore();

  const readingsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(collection(firestore, 'users', user.uid, 'readings'), orderBy('readingDate', 'desc'));
  }, [firestore, user]);

  const { data: readings, isLoading: areReadingsLoading } = useCollection<Reading>(readingsQuery);
  const [selectedReading, setSelectedReading] = useState<WithId<Reading> | null>(null);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || areReadingsLoading || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-accent" />
      </div>
    );
  }

  const handleReadingClick = (reading: WithId<Reading>) => {
    setSelectedReading(reading);
  };

  const handleBackToList = () => {
    setSelectedReading(null);
  };
  
  const getReadingDate = (reading: Reading) => {
    if (reading.readingDate && 'seconds' in reading.readingDate) {
        return format(new Date(reading.readingDate.seconds * 1000), 'PPP p');
    }
    return 'Date not available';
  }

  return (
    <>
      <AppNav />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        {selectedReading ? (
          <Card>
            <CardHeader>
              <div className='flex justify-between items-center'>
                <div>
                    <CardTitle>Reading from {getReadingDate(selectedReading)}</CardTitle>
                    <CardDescription>For birth date: {selectedReading.birthDate && 'seconds' in selectedReading.birthDate ? format(new Date(selectedReading.birthDate.seconds * 1000), 'PPP') : 'N/A'}</CardDescription>
                </div>
                <button onClick={handleBackToList} className="text-sm text-accent hover:underline">
                  &larr; Back to History
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <ReadingDetails reading={selectedReading} />
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Your Reading History</CardTitle>
            </CardHeader>
            <CardContent>
              {readings && readings.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {readings.map((reading) => (
                    <Card
                      key={reading.id}
                      className="cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => handleReadingClick(reading)}
                    >
                      <CardHeader>
                        <CardTitle className="text-lg">Reading from {getReadingDate(reading)}</CardTitle>
                        <CardDescription>
                          Born on: {reading.birthDate && 'seconds' in reading.birthDate ? format(new Date(reading.birthDate.seconds * 1000), 'PPP') : 'N/A'}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {reading.foundationalOverview}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  You have no saved readings yet. Go to the start page to generate one.
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </>
  );
}
