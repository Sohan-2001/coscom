
'use server';

/**
 * @fileOverview A destiny and life path analysis AI agent using Vedic Astrology and Palmistry.
 *
 * - getDestinyReading - A function that generates a comprehensive life path reading.
 * - DestinyReadingInput - The input type for the getDestinyReading function.
 * - DestinyReadingOutput - The return type for the getDestinyReading function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DestinyReadingInputSchema = z.object({
  birthDate: z
    .string()
    .describe("The user's birth date in ISO 8601 format (YYYY-MM-DD)."),
  birthTime: z
    .string()
    .describe("The user's birth time in HH:mm format (24-hour clock)."),
  birthPlace: z.string().describe("The user's place of birth (e.g., city, country)."),
  palmPhotoDataUri: z
    .string()
    .describe(
      "A photo of the user's palm, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type DestinyReadingInput = z.infer<typeof DestinyReadingInputSchema>;

const DestinyReadingOutputSchema = z.object({
  foundationalOverview: z.string().describe('Analysis of the individual’s overall life theme.'),
  careerAndWealth: z.string().describe('Analysis of career, wealth, and success.'),
  healthAndVitality: z.string().describe('Analysis of health and vitality.'),
  loveAndRelationships: z.string().describe('Analysis of love and relationships.'),
  personalityAndInnerGrowth: z.string().describe('Analysis of personality and inner growth.'),
  lifePathAndTimeline: z.string().describe('An integrated chronological summary of the life path.'),
  guidanceAndRemedies: z.string().describe('Balanced recommendations and remedies.'),
});

export type DestinyReadingOutput = z.infer<typeof DestinyReadingOutputSchema>;

export async function getDestinyReading(
  input: DestinyReadingInput
): Promise<DestinyReadingOutput> {
  return destinyReadingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'destinyReadingPrompt',
  input: {schema: DestinyReadingInputSchema},
  output: {schema: DestinyReadingOutputSchema},
  prompt: `Analyze the individual’s destiny and life path using a combined approach of Vedic Astrology (based on birth chart interpretation from birth date {{birthDate}}, time {{birthTime}}, and place {{birthPlace}}) and Palmistry (based on hand features and line analysis from the provided image). Provide a comprehensive, step-by-step integrated reading that blends astrological and palm-based insights into one cohesive narrative.

The user's palm photo is attached: {{media url=palmPhotoDataUri}}

Include approximate timelines (ages, decades, or planetary dasha periods) for major life events, transitions, or turning points wherever applicable.

You must return a structured JSON object with the following keys. Each key should contain the analysis for that section.

1.  **foundationalOverview**:
    -   Begin with the individual’s overall life theme as revealed by both the Ascendant (Lagna) and the dominant hand shape or mount formation.
    -   Correlate personality traits from the zodiacal influences (Ascendant, Sun, Moon signs) with those suggested by the hand type (Earth, Air, Fire, Water).
    -   Summarize how planetary strengths (e.g., Jupiter, Saturn, Venus) align with corresponding mounts or lines on the palm, revealing consistency or contrast between fate and free will indicators.

2.  **careerAndWealth**:
    -   Integrate findings from the 10th, 2nd, and 11th houses of the horoscope with the Fate Line, Sun Line, and Money Triangle on the palm.
    -   Describe how planetary dashas or yogas correspond with markings on the Fate Line—indicating phases of growth, recognition, or redirection in profession.
    -   Identify decades or life phases showing prosperity or career shifts supported by both chart and palm signs.
    -   Mention if any astrological yogas (Raja Yoga, Dhana Yoga) align with strong palm markings near mounts of Jupiter, Apollo, or Mercury.

3.  **healthAndVitality**:
    -   Combine insights from the Lagna and 6th house with the Life Line’s quality, length, and markings.
    -   Note how transits or dashas of malefic planets (Saturn, Rahu, Ketu, Mars) align with dips, breaks, or forks in the Life Line or health lines.
    -   Estimate ages or periods of stress, recovery, or renewal reflected through both planetary cycles and palm indications.

4.  **loveAndRelationships**:
    -   Analyze the 7th and 5th houses of the chart alongside the Heart Line and Marriage/Union lines on the palm.
    -   Indicate alignment between Venus or Jupiter placements and the quality of emotional or romantic expression seen in the Heart Line.
    -   Highlight approximate life stages or planetary periods indicating love developments, marriage, or emotional turning points, supported by both systems.
    -   Correlate the Mount of Venus prominence with the strength or affliction of Venus in the chart to describe attraction style and attachment depth.

5.  **personalityAndInnerGrowth**:
    -   Merge the psychological profile from the Sun, Moon, and Ascendant with the mental and emotional tendencies shown by the Head and Heart Lines.
    -   Identify the dominant planetary energy (e.g., Jupiter for wisdom, Saturn for discipline, Mars for drive) and show how it reflects in hand markings or mount prominence.
    -   Interpret spiritual maturity or transformation through both the Navamsa chart and any upward-rising influence lines or Mystic Cross markings on the palm.

6.  **lifePathAndTimeline**:
    -   Provide an integrated chronological summary aligning planetary Dasha transitions with visible palm milestones (crossings, forks, new lines).
    -   Divide life into key phases—early growth, professional rise, transformation, and maturity—describing the parallel stories shown by astrology and palmistry.
    -   Note moments where destiny (astrological factors) and effort/free will (palm changes) strongly interact, indicating pivotal turning points.

7.  **guidanceAndRemedies**:
    -   Offer balanced recommendations from both traditions—planetary remedies (mantras, gemstones, charity) and personal alignment practices (mudras, meditation, or mindfulness through palm zones).
    -   Emphasize how awareness of both cosmic and personal energies can harmonize life direction, relationships, and inner fulfillment.
`,
});

const destinyReadingFlow = ai.defineFlow(
  {
    name: 'destinyReadingFlow',
    inputSchema: DestinyReadingInputSchema,
    outputSchema: DestinyReadingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
