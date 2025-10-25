
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState, useTransition } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { generatePersonalizedInsightsAction } from '@/lib/actions';

const formSchema = z.object({
  date: z.date({
    required_error: 'A date of birth is required.',
  }),
  time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Please enter a valid time in HH:MM format.',
  }),
  location: z.string().min(2, 'Location must be at least 2 characters.'),
  heartLine: z.string().min(1, 'Please select a Heart Line description.'),
  headLine: z.string().min(1, 'Please select a Head Line description.'),
  lifeLine: z.string().min(1, 'Please select a Life Line description.'),
});

const palmistryOptions = {
  heartLine: [
    'Long and curved, showing emotional expressiveness.',
    'Short and straight, indicating reserved emotions.',
    'Starts below the index finger, suggesting a satisfying love life.',
    'Wavy, pointing to many relationships.',
  ],
  headLine: [
    'Long and straight, indicating logical thinking.',
    'Short and clear, showing practicality and focus.',
    'Curved or sloping, signifying creativity.',
    'Line is separated from life line, suggesting an adventurous spirit.',
  ],
  lifeLine: [
    'Long and deep, indicating vitality and a long life.',
    'Short and shallow, suggesting life may be controlled by others.',
    'Curved in a semicircle, showing strength and enthusiasm.',
    'Multiple life lines, pointing to extra vitality.',
  ],
};

type PalmLine = keyof typeof palmistryOptions;

export function CosmicForm() {
  const [isPending, startTransition] = useTransition();
  const [reading, setReading] = useState<string | null>(null);
  const { toast } = useToast();
  const palmImage = PlaceHolderImages.find((img) => img.id === 'palm-image');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      time: '12:00',
      location: '',
      heartLine: '',
      headLine: '',
      lifeLine: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setReading(null);
    startTransition(async () => {
      const result = await generatePersonalizedInsightsAction({
        astrologicalChart: {
          date: format(values.date, 'yyyy-MM-dd'),
          time: values.time,
          location: values.location,
        },
        palmistryInput: {
          heartLine: values.heartLine,
          headLine: values.headLine,
          lifeLine: values.lifeLine,
        },
      });

      if (result.success) {
        setReading(result.data?.insights ?? 'No insights could be generated.');
      } else {
        toast({
          variant: 'destructive',
          title: 'An error occurred',
          description: result.error,
        });
      }
    });
  }
  
  const renderPalmistryField = (name: PalmLine, label: string) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-foreground/80">{label}</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="bg-background/80">
                <SelectValue placeholder={`Select your ${label.toLowerCase()}...`} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {palmistryOptions[name].map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  return (
    <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8">
      <div className="lg:col-span-3">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="font-headline text-3xl">Your Celestial Blueprint</CardTitle>
                <CardDescription>Enter your birth details to generate your chart.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date of Birth</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={'outline'}
                                className={cn(
                                  'w-full pl-3 text-left font-normal bg-background/80',
                                  !field.value && 'text-muted-foreground'
                                )}
                              >
                                {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time of Birth</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} className="bg-background/80" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Place of Birth</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., New Delhi, India" {...field} className="bg-background/80"/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="font-headline text-3xl">The Lines of Fate</CardTitle>
                <CardDescription>Describe the major lines on your dominant hand.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                 {palmImage && (
                    <div className="relative w-full max-w-xs mx-auto">
                        <Image
                            src={palmImage.imageUrl}
                            alt={palmImage.description}
                            width={600}
                            height={800}
                            className="rounded-lg object-contain"
                            data-ai-hint={palmImage.imageHint}
                        />
                    </div>
                 )}
                <div className="space-y-4">
                  {renderPalmistryField('heartLine', 'Heart Line')}
                  {renderPalmistryField('headLine', 'Head Line')}
                  {renderPalmistryField('lifeLine', 'Life Line')}
                </div>
              </CardContent>
            </Card>
            
            <Button type="submit" size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg" disabled={isPending}>
              {isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Generate Your Reading'}
            </Button>
          </form>
        </Form>
      </div>

      <div className="lg:col-span-2">
        <Card className="sticky top-8 bg-card/80 backdrop-blur-sm border-border/50 min-h-[400px]">
          <CardHeader>
            <CardTitle className="font-headline text-3xl">Your Cosmic Reading</CardTitle>
            <CardDescription>Insights woven from the stars and your palm.</CardDescription>
          </CardHeader>
          <CardContent>
            {isPending && (
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[80%]" />
                <Skeleton className="h-4 w-full mt-4" />
                <Skeleton className="h-4 w-[90%]" />
              </div>
            )}
            {reading && !isPending && (
                <div className="prose prose-lg dark:prose-invert font-body whitespace-pre-wrap leading-relaxed">
                    {reading}
                </div>
            )}
            {!reading && !isPending && (
                <div className="text-center text-muted-foreground flex flex-col items-center justify-center min-h-[200px]">
                    <p>Your personalized insights will appear here.</p>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
