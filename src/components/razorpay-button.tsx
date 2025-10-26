
'use client';

import Script from 'next/script';

export function RazorpayButton() {
  return (
    <>
      <form>
          <Script
            id="razorpay-checkout-js"
            src="https://checkout.razorpay.com/v1/payment-button.js"
            data-payment_button_id="pl_RYEovtgtee8sZp"
            async
          />
      </form>
    </>
  );
}
