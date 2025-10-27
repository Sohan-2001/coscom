
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getPersonalizedHoroscope } from '@/app/actions';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loader2, Wand2, Lock } from 'lucide-react';
import { ZODIAC_SIGNS } from '@/data/zodiac';
import type { PersonalizedDailyHoroscopeOutput } from '@/ai/flows/personalized-daily-horoscope';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useUser } from '@/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

const formSchema = z.object({
  birthDate: z.string().min(1, 'Birth date is required.'),
  birthTime: z.string().min(1, 'Birth time is required.'),
  zodiacSign: z.string().min(1, 'Zodiac sign is required.'),
});

export function PersonalizedHoroscope() {
  const [isLoading, setIsLoading] = useState(false);
  const [horoscope, setHoroscope] =
    useState<PersonalizedDailyHoroscopeOutput | null>(null);
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      birthDate: '',
      birthTime: '',
      zodiacSign: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setHoroscope(null);
    const result = await getPersonalizedHoroscope(values);
    setIsLoading(false);
    if (result.success && result.data) {
      setHoroscope(result.data);
      if (user && firestore) {
        try {
          const horoscopesCol = collection(firestore, 'users', user.uid, 'horoscopes');
          await addDoc(horoscopesCol, {
            userId: user.uid,
            date: serverTimestamp(),
            content: result.data.horoscope,
            zodiacSign: values.zodiacSign,
          });
        } catch (error) {
          console.error("Error saving horoscope:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Could not save your horoscope to history.",
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

  return (
    <section id="horoscope" className="py-16 sm:py-24 bg-background">
      <div className="container max-w-4xl">
        <div className="text-center">
          <h2 className="text-2xl font-headline font-bold text-white sm:text-3xl">
            Your Daily Cosmic Forecast
          </h2>
          <p className="mt-4 text-base text-gray-300 sm:text-lg">
            Enter your birth details to generate a personalized horoscope for
            today, crafted by our AI astrologer.
          </p>
        </div>
        <Card className="mt-10 bg-card/50">
          <CardContent className="p-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                <FormField
                  control={form.control}
                  name="birthDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Birth Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} disabled={!user} />
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
                      <FormLabel>Birth Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} disabled={!user} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="zodiacSign"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zodiac Sign</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={!user}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your sign" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {ZODIAC_SIGNS.map((sign) => (
                            <SelectItem key={sign.name} value={sign.name}>
                              {sign.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="md:col-span-3 text-center pt-4">
                  <Button type="submit" disabled={isLoading || !user} size="lg">
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
                        <Wand2 className="mr-2 h-4 w-4" /> Generate Horoscope
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {horoscope && (
          <Card className="mt-8 animate-fade-in bg-card/50">
            <CardHeader>
              <CardTitle>Your Personalized Horoscope</CardTitle>
              <CardDescription>Insights for your day ahead.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap font-body text-base text-gray-300">
                {horoscope.horoscope}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}
