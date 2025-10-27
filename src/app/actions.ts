
'use server';

import {
  getDestinyReading,
  type DestinyReadingInput,
  type DestinyReadingOutput,
} from '@/ai/flows/destiny-reading-flow';

export async function generateDestinyReading(input: DestinyReadingInput): Promise<{ success: boolean, data?: DestinyReadingOutput, error?: string }> {
  try {
    const result = await getDestinyReading(input);
    return { success: true, data: result };
  } catch (error: any) {
    console.error(error);
    return {
      success: false,
      error: error.message || 'Failed to generate destiny reading. Please try again.',
    };
  }
}
