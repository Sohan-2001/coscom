
'use server';
import { getPersonalizedInsights, type PersonalizedInsightsInput, type PersonalizedInsightsOutput } from '@/ai/flows/personalized-insights';
import { getFirestore } from 'firebase-admin/firestore';
import { FieldValue } from 'firebase-admin/firestore';
import Razorpay from 'razorpay';
import { initializeApp, getApps } from 'firebase-admin/app';

// Ensure Firebase Admin is initialized
if (!getApps().length) {
  initializeApp();
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
      userId,
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

export async function createOrderAction(userId: string, amount: number, currency: string) {
  if (!userId) {
    return { success: false, error: 'User not authenticated.' };
  }
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return { success: false, error: 'Razorpay credentials are not configured.' };
  }

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  const options = {
    amount: amount * 100, // amount in the smallest currency unit
    currency,
    receipt: `receipt_order_${new Date().getTime()}`,
  };

  try {
    const razorpayOrder = await razorpay.orders.create(options);
    const db = getFirestore();
    const orderRef = db.collection('users').doc(userId).collection('orders').doc();

    await orderRef.set({
      userId,
      amount,
      currency,
      status: 'pending',
      createdAt: FieldValue.serverTimestamp(),
      razorpayOrderId: razorpayOrder.id,
    });

    return { success: true, orderId: orderRef.id, razorpayOrderId: razorpayOrder.id };
  } catch (error) {
    console.error('Error creating order:', error);
    return { success: false, error: 'Could not create your order. Please try again.' };
  }
}
