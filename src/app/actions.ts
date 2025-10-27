'use server';

import {
  getDestinyReading,
  type DestinyReadingInput,
} from '@/ai/flows/destiny-reading-flow';

export async function generateDestinyReading(input: DestinyReadingInput) {
  try {
    const result = await getDestinyReading(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: 'Failed to generate destiny reading. Please try again.',
    };
  }
}
