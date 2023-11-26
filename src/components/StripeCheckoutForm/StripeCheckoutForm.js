import { useState, useEffect } from 'react';
import {useStripe, useElements, PaymentElement} from '@stripe/react-stripe-js';
import Loading from 'components/Loading';
import { Button } from '@mui/material';
import config from 'config';
const { EMAIL_CONTACT } = config;

export default function StripeCheckoutForm({ setError, processing, setProcessing, clientSecretRef, saveOrderToFirebase }) {
  const [ready, setReady] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    if (stripe && elements) {
      setReady(true);
      // console.log('ready');
    }
  }, [stripe, elements]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);
    setError(null);

    if (!stripe || !elements) {
      return;
    }

    const result = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
      confirmParams: {
        return_url: "http://localhost:3000/error-contact-support", // not needed for cards or apple/google pay
      },
    });

    if (result.error) {
      // Show error to your customer (for example, payment details incomplete)
      // console.log(result.error.message);
      setProcessing(false);
      setError(`Stripe encountered an error: ${result.error.message}. Please try again or contact ${EMAIL_CONTACT}.`);
    } else if (result.paymentIntent.status === 'succeeded') {
      // console.log('success', result);
      clientSecretRef.current = null;
      saveOrderToFirebase(result);
    } else {
      // console.log('unexpected Stripe status', result);
      setProcessing(false);
      setError(`Stripe encountered an unexpected error: ${result.error.message}. Please contact ${EMAIL_CONTACT}.`);
      // will also likely redirect to return_url, which is just an error page in this case
    }
  };

  return (
    <>
      {ready &&
        <form onSubmit={handleSubmit}>
          <PaymentElement />
          <Button type='submit' variant='contained' color='success' disabled={!stripe || processing} sx={{ my: 2 }}>Register and submit payment</Button>
        </form>
      }
      {!ready &&
        <Loading isHeading={false} text='Loading payment options...' />
      }
    </>
  );
}
