import { useEffect, useCallback } from 'react';
import { useOrder } from 'components/OrderContext';
import { getFunctions, httpsCallable } from 'firebase/functions';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import Loading from 'components/Loading';
import { Box } from '@mui/material';
import StripeCheckoutForm from 'components/StripeCheckoutForm';
import { fullName } from 'utils';
import config from 'config';
const { SANDBOX_MODE, PAYMENT_METHODS, EMAIL_CONTACT } = config;
const functions = getFunctions();
const createStripePaymentIntent = httpsCallable(functions, 'createStripePaymentIntent');
const updateStripePaymentIntent = httpsCallable(functions, 'updateStripePaymentIntent');
const stripePromise = PAYMENT_METHODS.includes('stripe') ? await loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY) : null;

export default function StripeCheckoutWrapper({ total, processing, setProcessing, setError, prepOrderForFirebase }) {
  const { order, clientSecret, setClientSecret } = useOrder();

  const createPaymentIntent = useCallback(async () => {
    try {
      const { data } = await createStripePaymentIntent({
        amount: total, // amount in dollars
        name: fullName(order.people[0]),
        email: order.people[0].email,
        idempotencyKey: order.idempotencyKey
      });
      setClientSecret(data.clientSecret);
    } catch (error) {
      console.error(error);
      setError(`We encountered an error initializing Stripe. Please try again or contact ${EMAIL_CONTACT}.`);
    }
  }, [total, order, setClientSecret, setError]);

  const updatePaymentIntent = useCallback(async () => {
    if (!clientSecret) return;
    const paymentIntentId = clientSecret.split('_secret_')[0];
    try {
      await updateStripePaymentIntent({
        paymentIntentId,
        amount: total, // amount in dollars
      });
    } catch (error) {
      console.error(error);
      setError(`We encountered an error initializing Stripe. Please try again or contact ${EMAIL_CONTACT}.`);
    }
  }, [total, clientSecret, setError]);

  useEffect(() => {
    if (!clientSecret) createPaymentIntent();
  }, [createPaymentIntent, clientSecret]);

  useEffect(() => {
    updatePaymentIntent();
  }, [updatePaymentIntent, total]);

  return (
    <>
      {SANDBOX_MODE &&
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '3rem', my: 2, backgroundColor: 'var(--color-error)' }}>
          Testing: 4242424242424242 / any future expiration / any cvc / any zip
        </Box>
      }

      {clientSecret ?
        <Elements stripe={stripePromise} options={{ clientSecret }} key={clientSecret}>
          <StripeCheckoutForm
            setError={setError}
            processing={processing} setProcessing={setProcessing}
            prepOrderForFirebase={prepOrderForFirebase}
          />
        </Elements>
      :
        <Box align='center'>
					<Loading isHeading={false} text='Loading payment options...' />
				</Box>
      }
    </>
  );
}
