
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState, useTransition, useRef, useEffect } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { CalendarIcon, Loader2, Upload, Star, CheckCircle, Clock } from 'lucide-react';
import { type PersonalizedInsightsOutput } from '@/ai/flows/personalized-insights';

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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose, DialogTrigger } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { generatePersonalizedInsightsAction, saveReadingAction, createOrderAction } from '@/lib/actions';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useUser, useDoc, useMemoFirebase } from '@/firebase';
import { doc, getFirestore } from 'firebase/firestore';
import { RazorpayButton } from './razorpay-button';

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

function CalendarWithOkButton({ field }: { field: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(field.value);

  const handleOkClick = () => {
    field.onChange(selectedDate);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
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
      </DialogTrigger>
      <DialogContent className="w-auto p-0">
        <DialogTitle className="sr-only">Select Date of Birth</DialogTitle>
        <div className="bg-teal-500 text-white p-3 rounded-t-md">
          <div className="text-md">{selectedDate ? format(selectedDate, 'yyyy') : new Date().getFullYear()}</div>
          <div className="text-xl font-bold">{selectedDate ? format(selectedDate, 'E, MMM d') : 'Pick a date'}</div>
        </div>
        <Calendar
          mode="single"
          captionLayout="dropdown-buttons"
          fromYear={1900}
          toYear={new Date().getFullYear()}
          selected={selectedDate}
          onSelect={setSelectedDate}
          disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
          initialFocus
        />
        <div className="p-2 border-t flex justify-end">
          <Button onClick={handleOkClick} size="sm">OK</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}


function TimePickerWithOkButton({ field }: { field: any }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedTime, setSelectedTime] = useState<string>(field.value);
  
    const handleOkClick = () => {
      field.onChange(selectedTime);
      setIsOpen(false);
    };
  
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <FormControl>
            <Button
              variant={'outline'}
              className={cn(
                'w-full pl-3 text-left font-normal bg-background/80',
                !field.value && 'text-muted-foreground'
              )}
            >
              {field.value ? field.value : <span>Pick a time</span>}
              <Clock className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </FormControl>
        </DialogTrigger>
        <DialogContent className="w-auto p-4">
          <DialogHeader>
            <DialogTitle>Select Time of Birth</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="bg-background/80"
            />
          </div>
          <DialogFooter>
            <Button onClick={handleOkClick} size="sm">OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

export function CosmicForm() {
  const { user } = useUser();
  const [isPending, startTransition] = useTransition();
  const [isSaving, startSavingTransition] = useTransition();
  const [reading, setReading] = useState<PersonalizedInsightsOutput | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [order, setOrder] = useState<{ id: string, razorpayOrderId: string } | null>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  const firestore = getFirestore();
  const orderRef = useMemoFirebase(() => {
      if (!user || !order) return null;
      return doc(firestore, 'users', user.uid, 'orders', order.id);
  }, [firestore, user, order]);

  const { data: orderData } = useDoc(orderRef);

  const paymentCompleted = orderData?.status === 'completed';

  useEffect(() => {
    if (paymentCompleted) {
        toast({
            title: 'Payment Successful!',
            description: 'Your payment has been verified. Generating your reading now...',
            className: 'bg-green-500 text-white',
        });
        handleGenerateReading();
    }
  }, [paymentCompleted]);

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

  async function onFormSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
        toast({ variant: 'destructive', title: 'You must be logged in' });
        return;
    }
    startTransition(async () => {
        const result = await createOrderAction(user.uid, 11, 'INR');
        if (result.success && result.orderId && result.razorpayOrderId) {
            setOrder({ id: result.orderId, razorpayOrderId: result.razorpayOrderId });
            setShowPaymentDialog(true);
        } else {
            toast({ variant: 'destructive', title: 'Could not create order', description: result.error });
        }
    });
  }

  function handleGenerateReading() {
    const values = form.getValues();
    setReading(null);
    setShowPaymentDialog(false);
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
        setReading(result.data ?? null);
      } else {
        toast({
          variant: 'destructive',
          title: 'An error occurred',
          description: result.error,
        });
      }
    });
  }

  const handleSaveReading = () => {
    if (!reading || !user) return;
    const values = form.getValues();
    startSavingTransition(async () => {
      const result = await saveReadingAction(user.uid, reading, {
        date: values.date,
        time: values.time,
        location: values.location
      });
      if (result.success) {
        toast({
          title: 'Reading Saved!',
          description: 'Your cosmic insights have been saved to your profile.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Failed to Save',
          description: result.error,
        });
      }
    });
  };

  const readingSections = reading ? [
    { title: 'Foundational Overview', content: reading.foundationalOverview },
    { title: 'Career, Wealth & Success', content: reading.careerWealthSuccess },
    { title: 'Health & Vitality', content: reading.healthVitality },
    { title: 'Love & Relationships', content: reading.loveRelationships },
    { title: 'Personality & Inner Growth', content: reading.personalityInnerGrowth },
    { title: 'Life Path & Timeline Summary', content: reading.lifePathTimeline },
    { title: 'Guidance & Remedies', content: reading.guidanceRemedies },
  ] : [];

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-8 p-4">
      <div className="w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-8">
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="font-headline text-3xl">Your Celestial Blueprint</CardTitle>
                <CardDescription>Enter your birth details to generate your chart.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth</FormLabel>
                        <CalendarWithOkButton field={field} />
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
                        <TimePickerWithOkButton field={field} />
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
              {isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Generate Your Reading for ₹11'}
            </Button>
          </form>
        </Form>
      </div>

      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Complete Your Payment</DialogTitle>
                <DialogDescription>
                    Please complete the payment to generate your cosmic reading. Your reading will generate automatically after successful payment.
                </DialogDescription>
            </DialogHeader>
            
            {orderData?.status === 'pending' && (
                <div className="flex justify-center items-center py-8 flex-col gap-4">
                    <RazorpayButton razorpayOrderId={order!.razorpayOrderId} amount={11} />
                     <p className="text-sm text-muted-foreground">Waiting for payment confirmation...</p>
                    <Loader2 className="h-6 w-6 animate-spin" />
                </div>
            )}
            
            {paymentCompleted && (
                <div className="text-center py-4 flex flex-col items-center gap-4">
                    <CheckCircle className="h-12 w-12 text-green-500" />
                    <p className="text-green-500 font-semibold">Payment Successful!</p>
                    <p>Your reading is being generated...</p>
                </div>
            )}

            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="w-full">
        <Card className="bg-card/80 backdrop-blur-sm border-border/50 min-h-[400px]">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="font-headline text-3xl">Your Cosmic Reading</CardTitle>
                <CardDescription>Insights woven from the stars and your palm.</CardDescription>
              </div>
              {reading && !isPending && (
                <Button onClick={handleSaveReading} disabled={isSaving}>
                  {isSaving ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Star className="mr-2 h-4 w-4" />
                  )}
                  Save Reading
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isPending && !reading && (
              <div className="space-y-4 pt-4 flex flex-col items-center">
                <Loader2 className="h-8 w-8 animate-spin text-accent" />
                <p className='text-muted-foreground'>Generating your reading... this may take a moment.</p>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[80%]" />
                <Skeleton className="h-4 w-full mt-4" />
                <Skeleton className="h-4 w-[90%]" />
              </div>
            )}
            {reading && !isPending && (
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
