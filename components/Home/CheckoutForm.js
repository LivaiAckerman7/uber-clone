import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React from 'react';

function CheckoutForm({ amount }) {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!elements || !stripe) {
      return;
    }

    const res = await fetch('/api/create-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ amount: amount })
    });

    const { clientSecret } = await res.json();
    console.log(clientSecret);

    const { error } = await stripe.confirmPayment({
      clientSecret: clientSecret,
      elements,
      confirmParams: {
        return_url: 'http://localhost:3000/'
      }
    });

    if (error) {
      console.error(error.message);
      // Gérer l'erreur de manière appropriée
    } else {
      console.log('Payment successful');
    }
  };

  return (
    <div className='flex flex-col justify-center items-center w-full mt-12'>
      <h2 className='m-5 font-bold'>Somme à payer : {amount} FCFA</h2>
      <form onSubmit={handleSubmit} className='max-w-md'>
        <PaymentElement />
        <button className='w-full bg-black text-white p-2 rounded-lg mt-2'>Payer</button>
      </form>
    </div>
  );
}

export default CheckoutForm;
