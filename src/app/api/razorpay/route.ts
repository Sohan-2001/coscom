
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, App } from 'firebase-admin/app';

// Ensure Firebase Admin is initialized
if (!getApps().length) {
  initializeApp();
}

export async function POST(req: NextRequest) {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    console.error('RAZORPAY_KEY_SECRET is not set');
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }

  const text = await req.text();
  const signature = req.headers.get('x-razorpay-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Signature not found' }, { status: 400 });
  }

  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(text);
  const generatedSignature = hmac.digest('hex');

  if (generatedSignature !== signature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const event = JSON.parse(text);

  if (event.event === 'payment.captured') {
    const payment = event.payload.payment.entity;
    const razorpayOrderId = payment.order_id;
    
    try {
      const db = getFirestore();
      // Find the user and order associated with this razorpayOrderId
      const ordersQuery = db.collectionGroup('orders').where('razorpayOrderId', '==', razorpayOrderId).limit(1);
      const querySnapshot = await ordersQuery.get();

      if (querySnapshot.empty) {
        console.error(`No order found for Razorpay order ID: ${razorpayOrderId}`);
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }

      const orderDoc = querySnapshot.docs[0];
      await orderDoc.ref.update({
        status: 'completed',
        paymentId: payment.id,
      });

      console.log(`Order ${orderDoc.id} updated to completed.`);
    } catch (error) {
      console.error('Error updating order in Firestore:', error);
      return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }
  }

  return NextResponse.json({ status: 'ok' });
}
