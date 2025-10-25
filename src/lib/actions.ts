
'use server';
import { getPersonalizedInsights, type PersonalizedInsightsInput } from '@/ai/flows/personalized-insights';

export async function generatePersonalizedInsightsAction(input: PersonalizedInsightsInput) {
  try {
    const result = await getPersonalizedInsights(input);
    if (!result) {
      return { success: false, error: 'The cosmos is quiet... No insights were generated.' };
    }
    return { success: true, data: result };
  } catch (error) {
    console.error('Error generating personalized insights:', error);
    return { success: false, error: 'Failed to connect with the cosmos. Please try again.' };
  }
}
