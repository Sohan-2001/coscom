'use server';

/**
 * @fileOverview A Vedic astrology reading AI agent.
 *
 * - generateVedicReadings - A function that generates Vedic astrology readings.
 * - GenerateVedicReadingsInput - The input type for the generateVedicReadings function.
 * - GenerateVedicReadingsOutput - The return type for the generateVedicReadings function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateVedicReadingsInputSchema = z.object({
  planetaryPositions: z
    .string()
    .describe('Description of planetary positions in the birth chart.'),
  palmLines: z.string().describe('Description of selected palm lines.'),
});
export type GenerateVedicReadingsInput = z.infer<
  typeof GenerateVedicReadingsInputSchema
>;

const GenerateVedicReadingsOutputSchema = z.object({
  reading: z.string().describe('The generated Vedic astrology reading.'),
});
export type GenerateVedicReadingsOutput = z.infer<
  typeof GenerateVedicReadingsOutputSchema
>;

export async function generateVedicReadings(
  input: GenerateVedicReadingsInput
): Promise<GenerateVedicReadingsOutput> {
  return generateVedicReadingsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateVedicReadingsPrompt',
  input: {schema: GenerateVedicReadingsInputSchema},
  output: {schema: GenerateVedicReadingsOutputSchema},
  prompt: `You are a Vedic astrology expert. Generate a concise Vedic astrology reading based on the planetary positions and palm lines.

Planetary Positions: {{{planetaryPositions}}}
Palm Lines: {{{palmLines}}}

Reading:`,
});

const generateVedicReadingsFlow = ai.defineFlow(
  {
    name: 'generateVedicReadingsFlow',
    inputSchema: GenerateVedicReadingsInputSchema,
    outputSchema: GenerateVedicReadingsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
