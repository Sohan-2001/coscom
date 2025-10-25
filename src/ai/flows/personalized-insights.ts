'use server';

/**
 * @fileOverview This file contains the Genkit flow for generating personalized insights by combining astrological charts and palmistry inputs.
 *
 * - `getPersonalizedInsights` - A function that orchestrates the process of generating personalized insights.
 * - `PersonalizedInsightsInput` - The input type for the `getPersonalizedInsights` function, including astrological chart details and palmistry inputs.
 * - `PersonalizedInsightsOutput` - The output type for the `getPersonalizedInsights` function, representing the generated personalized insights.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AstrologicalChartSchema = z.object({
  date: z.string().describe('The date of birth.'),
  time: z.string().describe('The time of birth.'),
  location: z.string().describe('The location of birth.'),
});

const PalmistryInputSchema = z.object({
  heartLine: z.string().describe('Description of the heart line.'),
  headLine: z.string().describe('Description of the head line.'),
  lifeLine: z.string().describe('Description of the life line.'),
});

const PersonalizedInsightsInputSchema = z.object({
  astrologicalChart: AstrologicalChartSchema.describe('Astrological chart details.'),
  palmistryInput: PalmistryInputSchema.describe('Palmistry inputs.'),
});
export type PersonalizedInsightsInput = z.infer<typeof PersonalizedInsightsInputSchema>;

const PersonalizedInsightsOutputSchema = z.object({
  insights: z.string().describe('Personalized insights combining astrology and palmistry.'),
});
export type PersonalizedInsightsOutput = z.infer<typeof PersonalizedInsightsOutputSchema>;

export async function getPersonalizedInsights(input: PersonalizedInsightsInput): Promise<PersonalizedInsightsOutput> {
  return personalizedInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedInsightsPrompt',
  input: {schema: PersonalizedInsightsInputSchema},
  output: {schema: PersonalizedInsightsOutputSchema},
  prompt: `You are an expert in Vedic astrology and palmistry. You will generate personalized insights based on the provided astrological chart and palmistry inputs.

Astrological Chart:
Date: {{{astrologicalChart.date}}}
Time: {{{astrologicalChart.time}}}
Location: {{{astrologicalChart.location}}}

Palmistry Inputs:
Heart Line: {{{palmistryInput.heartLine}}}
Head Line: {{{palmistryInput.headLine}}}
Life Line: {{{palmistryInput.lifeLine}}}

Combine the information from the astrological chart and palmistry inputs to provide comprehensive and personalized insights. Focus on potential life events, influences, and personal characteristics.
`,
});

const personalizedInsightsFlow = ai.defineFlow(
  {
    name: 'personalizedInsightsFlow',
    inputSchema: PersonalizedInsightsInputSchema,
    outputSchema: PersonalizedInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
