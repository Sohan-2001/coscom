
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { generateDestinyReading } from '@/app/actions';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
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
import { Loader2, Wand2, Lock, Upload } from 'lucide-react';
import type { DestinyReadingOutput } from '@/ai/flows/destiny-reading-flow';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useUser } from '@/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import Image from 'next/image';

const formSchema = z.object({
  birthDate: z.string().min(1, 'Birth date is required.'),
  birthTime: z.string().min(1, 'Birth time is required.'),
  birthPlace: z.string().min(1, 'Birth place is required.'),
  palmPhoto: z.any().refine(fileList => fileList.length > 0, 'Palm photo is required.'),
});

export function DestinyReading() {
  const [isLoading, setIsLoading] = useState(false);
  const [reading, setReading] = useState<DestinyReadingOutput | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      birthDate: '',
      birthTime: '',
      birthPlace: '',
      palmPhoto: undefined,
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      form.setValue('palmPhoto', e.target.files);
    }
  };

  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setReading(null);

    const palmPhotoDataUri = await fileToDataUri(values.palmPhoto[0]);

    const result = await generateDestinyReading({
        birthDate: values.birthDate,
        birthTime: values.birthTime,
        birthPlace: values.birthPlace,
        palmPhotoDataUri,
    });

    setIsLoading(false);
    if (result.success && result.data) {
      setReading(result.data);
      if (user && firestore) {
        try {
          const readingsCol = collection(firestore, 'users', user.uid, 'readings');
          await addDoc(readingsCol, {
            userId: user.uid,
            date: serverTimestamp(),
            content: result.data,
            birthDate: values.birthDate,
            birthTime: values.birthTime,
            birthPlace: values.birthPlace,
          });
        } catch (error) {
          console.error("Error saving reading:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Could not save your reading to history.",
          });
        }
      }
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    }
  }

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

  return (
    <section id="reading" className="py-16 sm:py-24 bg-background">
      <div className="container max-w-4xl">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-headline font-bold text-white md:text-3xl">
            Your Destiny Reading
          </h2>
          <p className="mt-4 text-sm sm:text-base text-gray-300 md:text-lg">
            Enter your birth details and upload a photo of your palm for a comprehensive life path analysis.
          </p>
        </div>
        <Card className="mt-10 bg-card/50">
          <CardContent className="p-4 sm:p-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <FormField
                  control={form.control}
                  name="birthDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm">Birth Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} disabled={!user} className="text-xs sm:text-sm" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="birthTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm">Birth Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} disabled={!user} className="text-xs sm:text-sm" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="birthPlace"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="text-xs sm:text-sm">Birth Place</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. London, UK" {...field} disabled={!user} className="text-xs sm:text-sm" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="md:col-span-2">
                  <FormLabel className="text-xs sm:text-sm">Palm Photo</FormLabel>
                  <FormControl>
                    <div className="mt-2 flex justify-center rounded-lg border border-dashed border-input px-6 py-10">
                      <div className="text-center">
                        {preview ? (
                          <Image src={preview} alt="Palm preview" width={200} height={200} className="mx-auto rounded-md" />
                        ) : (
                          <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        )}
                        <div className="mt-4 flex text-sm leading-6 text-gray-400">
                          <label
                            htmlFor="palm-photo"
                            className="relative cursor-pointer rounded-md font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:text-primary/80"
                          >
                            <span>Upload a file</span>
                            <input id="palm-photo" name="palmPhoto" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" disabled={!user} />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs leading-5 text-gray-400">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    </div>
                  </FormControl>
                   <FormMessage>{form.formState.errors.palmPhoto?.message as React.ReactNode}</FormMessage>
                </div>


                <div className="md:col-span-2 text-center pt-2">
                  <Button type="submit" disabled={isLoading || !user} className="w-full sm:w-auto text-xs sm:text-sm" size="default">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />{' '}
                        Generating...
                      </>
                    ) : !user ? (
                      <>
                        <Lock className="mr-2 h-4 w-4" /> Please Login to Generate
                      </>
                    ) : (
                      <>
                        <Wand2 className="mr-2 h-4 w-4" /> Generate Reading
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {reading && (
          <Card className="mt-8 animate-fade-in bg-card/50">
            <CardHeader>
              <CardTitle>Your Destiny Reading</CardTitle>
              <CardDescription>An integrated analysis of your life path.</CardDescription>
            </CardHeader>
            <CardContent>
               <Accordion type="single" collapsible className="w-full" defaultValue="foundationalOverview">
                {readingSections.map((sectionKey) => (
                  reading[sectionKey] && (
                    <AccordionItem value={sectionKey} key={sectionKey}>
                      <AccordionTrigger className="text-lg font-semibold text-primary">
                        {sectionTitles[sectionKey]}
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="whitespace-pre-wrap font-body text-base text-gray-300">
                          {reading[sectionKey]}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  )
                ))}
              </Accordion>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}
