import { useState, useEffect } from 'react';
import {useStripe, useElements, PaymentElement} from '@stripe/react-stripe-js';
import Loading from 'components/Loading';
import { Box, Button } from '@mui/material';
import config from 'config';
const { EMAIL_CONTACT } = config;

export default function StripeCheckoutForm({ setError, processing, setProcessing, clientSecretRef, saveOrderToFirebase, setOrder }) {
  const [ready, setReady] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    if (stripe && elements) {
      setReady(true);
    }
  }, [stripe, elements]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;
    const order = await saveOrderToFirebase();
    if (order) processPayment(order);
  };

  const processPayment = async (order) => {
    const result = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
      confirmParams: {
        return_url: "http://localhost:3000/error-contact-support", // not needed for cards or apple/google pay
      },
    });

    if (result.error) {
      // e.g. payment details incomplete
      // this results in record left in pendingOrders db
      setProcessing(false);
      setError(`Your payment could not be completed: ${result.error.message}. Please try again or contact ${EMAIL_CONTACT}.`);
    } else if (result.paymentIntent.status === 'succeeded') {
      clientSecretRef.current = null;
      setOrder({ ...order, paymentId: result.paymentIntent.id })
    } else {
      setProcessing(false);
      setError(`Stripe encountered an unexpected error: ${result.error.message}. Please contact ${EMAIL_CONTACT}.`);
      // will also likely redirect to return_url, which is just an error page in this case
    }
  };

  return (
    <>
      {ready &&
        <form onSubmit={handleSubmit}>
          <Box sx={{ visibility: processing ? 'hidden' : 'visible', height: processing ? 0 : 'auto' }}>
            <PaymentElement />
            <Button type='submit' variant='contained' color='success' disabled={!stripe || processing} sx={{ my: 2 }}>Register and submit payment</Button>
          </Box>
        </form>
      }
      {!ready &&
        <Loading isHeading={false} text='Loading payment options...' />
      }
    </>
  );
}
