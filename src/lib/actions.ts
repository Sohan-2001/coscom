
'use server';
import { getPersonalizedInsights, type PersonalizedInsightsInput, type PersonalizedInsightsOutput } from '@/ai/flows/personalized-insights';
import { auth } from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { FieldValue } from 'firebase-admin/firestore';

async function getUserId() {
    // This is a placeholder for getting the current user's ID.
    // In a real app, you'd get this from the session or a token.
    // For now, we'll simulate it. In a real scenario, you might have to
    // pass the user's auth token from the client and verify it on the server.
    return 'test-user';
}


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

export async function saveReadingAction(
  userId: string,
  reading: PersonalizedInsightsOutput,
  formData: { date: Date; time: string; location: string }
) {
  if (!userId) {
    return { success: false, error: 'User not authenticated.' };
  }

  try {
    const db = getFirestore();
    const readingRef = db.collection('users').doc(userId).collection('readings').doc();

    await readingRef.set({
      ...reading,
      readingDate: FieldValue.serverTimestamp(),
      birthDate: formData.date,
      birthTime: formData.time,
      birthLocation: formData.location,
    });

    return { success: true, readingId: readingRef.id };
  } catch (error) {
    console.error('Error saving reading to Firestore:', error);
    return { success: false, error: 'Could not save your reading. Please try again.' };
  }
}
