
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState, useTransition, useRef } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { CalendarIcon, Loader2, Upload } from 'lucide-react';

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
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { generatePersonalizedInsightsAction } from '@/lib/actions';

const formSchema = z.object({
  date: z.date({
    required_error: 'A date of birth is required.',
  }),
  time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Please enter a valid time in HH:MM format.',
  }),
  location: z.string().min(2, 'Location must be at least 2 characters.'),
  palmImage: z.string().min(1, 'Please upload an image of your palm.'),
});

export function CosmicForm() {
  const [isPending, startTransition] = useTransition();
  const [reading, setReading] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      time: '12:00',
      location: '',
      palmImage: '',
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setImagePreview(dataUrl);
        form.setValue('palmImage', dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

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
          palmImage: values.palmImage,
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
                <CardDescription>Upload an image of your dominant hand's palm.</CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="palmImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div
                          className="w-full h-64 border-2 border-dashed border-muted-foreground/50 rounded-lg flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/10 transition-colors"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            className="hidden"
                            accept="image/*"
                          />
                          {imagePreview ? (
                            <Image
                              src={imagePreview}
                              alt="Palm preview"
                              width={256}
                              height={256}
                              className="max-h-full w-auto object-contain rounded-md"
                            />
                          ) : (
                            <div className="flex flex-col items-center gap-2 text-muted-foreground">
                              <Upload className="h-8 w-8" />
                              <p>Click to upload an image</p>
                              <p className="text-xs">PNG, JPG, GIF up to 10MB</p>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
