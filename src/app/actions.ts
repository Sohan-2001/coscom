'use server';

import {
  personalizedDailyHoroscope,
  type PersonalizedDailyHoroscopeInput,
} from '@/ai/flows/personalized-daily-horoscope';

export async function getPersonalizedHoroscope(
  input: PersonalizedDailyHoroscopeInput
) {
  try {
    const result = await personalizedDailyHoroscope(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: 'Failed to generate horoscope. Please try again.',
    };
  }
}
