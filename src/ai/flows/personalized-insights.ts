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
  palmImage: z.string().describe("A photo of a user's palm, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});

const PersonalizedInsightsInputSchema = z.object({
  astrologicalChart: AstrologicalChartSchema.describe('Astrological chart details.'),
  palmistryInput: PalmistryInputSchema.describe('Palmistry inputs.'),
});
export type PersonalizedInsightsInput = z.infer<typeof PersonalizedInsightsInputSchema>;

const PersonalizedInsightsOutputSchema = z.object({
  foundationalOverview: z.string().describe("The individual's overall life theme, personality traits, and planetary strengths based on both astrology and palmistry."),
  careerWealthSuccess: z.string().describe('Integrated analysis of career, wealth, and success prospects, correlating horoscope houses with palm lines.'),
  healthVitality: z.string().describe('Insights into health and vitality, combining analysis of the horoscope with the Life Line on the palm.'),
  loveRelationships: z.string().describe("Analysis of love and relationships, blending insights from the user's birth chart and palm's Heart and Union lines."),
  personalityInnerGrowth: z.string().describe('A psychological profile merging astrological data with insights from the Head and Heart lines of the palm.'),
  lifePathTimeline: z.string().describe('A chronological summary of life phases, aligning planetary periods (Dashas) with palm milestones.'),
  guidanceRemedies: z.string().describe('Balanced recommendations from both Vedic astrology and palmistry traditions to harmonize life direction.'),
});
export type PersonalizedInsightsOutput = z.infer<typeof PersonalizedInsightsOutputSchema>;

export async function getPersonalizedInsights(input: PersonalizedInsightsInput): Promise<PersonalizedInsightsOutput> {
  return personalizedInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedInsightsPrompt',
  input: {schema: PersonalizedInsightsInputSchema},
  output: {schema: PersonalizedInsightsOutputSchema},
  prompt: `Analyze the individual’s destiny and life path using a combined approach of Vedic Astrology (based on birth chart interpretation) and Palmistry (based on hand features and line analysis). Provide a comprehensive, step-by-step integrated reading that blends astrological and palm-based insights into one cohesive narrative.

Include approximate timelines (ages, decades, or planetary dasha periods) for major life events, transitions, or turning points wherever applicable.

Astrological Chart:
Date: {{{astrologicalChart.date}}}
Time: {{{astrologicalChart.time}}}
Location: {{{astrologicalChart.location}}}

Palmistry Input (analyze the provided image):
{{media url=palmistryInput.palmImage}}

Structure the analysis as follows:


1. Foundational Overview:
- Begin with the individual’s overall life theme as revealed by both the Ascendant (Lagna) and the dominant hand shape or mount formation.
- Correlate personality traits from the zodiacal influences (Ascendant, Sun, Moon signs) with those suggested by the hand type (Earth, Air, Fire, Water).
- Summarize how planetary strengths (e.g., Jupiter, Saturn, Venus) align with corresponding mounts or lines on the palm, revealing consistency or contrast between fate and free will indicators.


2. Career, Wealth, and Success:
- Integrate findings from the 10th, 2nd, and 11th houses of the horoscope with the Fate Line, Sun Line, and Money Triangle on the palm.
- Describe how planetary dashas or yogas correspond with markings on the Fate Line—indicating phases of growth, recognition, or redirection in profession.
- Identify decades or life phases showing prosperity or career shifts supported by both chart and palm signs.
- Mention if any astrological yogas (Raja Yoga, Dhana Yoga) align with strong palm markings near mounts of Jupiter, Apollo, or Mercury.


3. Health and Vitality:
- Combine insights from the Lagna and 6th house with the Life Line’s quality, length, and markings.
- Note how transits or dashas of malefic planets (Saturn, Rahu, Ketu, Mars) align with dips, breaks, or forks in the Life Line or health lines.
- Estimate ages or periods of stress, recovery, or renewal reflected through both planetary cycles and palm indications.


4. Love and Relationships:
- Analyze the 7th and 5th houses of the chart alongside the Heart Line and Marriage/Union lines on the palm.
- Indicate alignment between Venus or Jupiter placements and the quality of emotional or romantic expression seen in the Heart Line.
- Highlight approximate life stages or planetary periods indicating love developments, marriage, or emotional turning points, supported by both systems.
- Correlate the Mount of Venus prominence with the strength or affliction of Venus in the chart to describe attraction style and attachment depth.


5. Personality and Inner Growth:
- Merge the psychological profile from the Sun, Moon, and Ascendant with the mental and emotional tendencies shown by the Head and Heart Lines.
- Identify the dominant planetary energy (e.g., Jupiter for wisdom, Saturn for discipline, Mars for drive) and show how it reflects in hand markings or mount prominence.
- Interpret spiritual maturity or transformation through both the Navamsa chart and any upward-rising influence lines or Mystic Cross markings on the palm.


6. Life Path and Timeline Summary:
- Provide an integrated chronological summary aligning planetary Dasha transitions with visible palm milestones (crossings, forks, new lines).
- Divide life into key phases—early growth, professional rise, transformation, and maturity—describing the parallel stories shown by astrology and palmistry.
- Note moments where destiny (astrological factors) and effort/free will (palm changes) strongly interact, indicating pivotal turning points.


7. Guidance and Remedies:
- Offer balanced recommendations from both traditions—planetary remedies (mantras, gemstones, charity) and personal alignment practices (mudras, meditation, or mindfulness through palm zones).
- Emphasize how awareness of both cosmic and personal energies can harmonize life direction, relationships, and inner fulfillment.
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
