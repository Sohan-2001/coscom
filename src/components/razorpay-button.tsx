
'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayButtonProps {
  razorpayOrderId: string;
}

export function RazorpayButton({ razorpayOrderId }: RazorpayButtonProps) {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    const openCheckout = () => {
      if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
        console.error('Razorpay Key ID is not defined');
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: "10000", // amount in the smallest currency unit
        currency: "INR",
        name: "Cosmic Compass",
        description: "Personalized Vedic Reading",
        order_id: razorpayOrderId,
        handler: function (response: any) {
           // This is where you would ideally handle the success on client side
           // But we are using webhooks for verification, so this can be minimal
           console.log('Razorpay Response:', response);
        },
        prefill: {
            name: "",
            email: "",
            contact: ""
        },
        notes: {
            address: "Cosmic Compass Corporate Office"
        },
        theme: {
            color: "#3399cc"
        }
      };
      
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response: any){
        console.error('Payment Failed:', response);
      });
      rzp.open();
    }
    
    script.onload = () => {
      openCheckout();
    }

    return () => {
      document.body.removeChild(script);
    };

  }, [razorpayOrderId]);


  return null; // The button is created by the Razorpay script
}
