'use server';

/**
 * @fileOverview A personalized daily horoscope AI agent.
 *
 * - personalizedDailyHoroscope - A function that generates a personalized daily horoscope.
 * - PersonalizedDailyHoroscopeInput - The input type for the personalizedDailyHoroscope function.
 * - PersonalizedDailyHoroscopeOutput - The return type for the personalizedDailyHoroscope function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedDailyHoroscopeInputSchema = z.object({
  birthDate: z
    .string()
    .describe("The user's birth date in ISO 8601 format (YYYY-MM-DD)."),
  birthTime: z
    .string()
    .describe("The user's birth time in HH:mm format (24-hour clock)."),
  zodiacSign: z.string().describe('The zodiac sign of the user.'),
});
export type PersonalizedDailyHoroscopeInput = z.infer<
  typeof PersonalizedDailyHoroscopeInputSchema
>;

const PersonalizedDailyHoroscopeOutputSchema = z.object({
  horoscope: z
    .string()
    .describe('The personalized daily horoscope for the user.'),
});
export type PersonalizedDailyHoroscopeOutput = z.infer<
  typeof PersonalizedDailyHoroscopeOutputSchema
>;

export async function personalizedDailyHoroscope(
  input: PersonalizedDailyHoroscopeInput
): Promise<PersonalizedDailyHoroscopeOutput> {
  return personalizedDailyHoroscopeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedDailyHoroscopePrompt',
  input: {schema: PersonalizedDailyHoroscopeInputSchema},
  output: {schema: PersonalizedDailyHoroscopeOutputSchema},
  prompt: `You are an astrologer providing personalized daily horoscopes.

  Based on the user's birth date ({{birthDate}}), birth time ({{birthTime}}), and zodiac sign ({{zodiacSign}}), generate a personalized daily horoscope providing insights and guidance for the day.
  The horoscope should be relevant to the user's sign and consider the current astrological transits.
  Focus on providing positive guidance and actionable advice.
  Keep the horoscope concise and easy to understand.

  Horoscope:`,
});

const personalizedDailyHoroscopeFlow = ai.defineFlow(
  {
    name: 'personalizedDailyHoroscopeFlow',
    inputSchema: PersonalizedDailyHoroscopeInputSchema,
    outputSchema: PersonalizedDailyHoroscopeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
