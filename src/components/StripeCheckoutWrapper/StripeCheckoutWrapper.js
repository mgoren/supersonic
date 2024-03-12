import { useState, useEffect, useCallback } from 'react';
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

export default function StripeCheckoutWrapper({ total, processCheckout }) {
  const { order, clientSecret, setClientSecret, setError, lastUpdatedTotal, setLastUpdatedTotal } = useOrder();
  const [ready, setReady] = useState(false);

  const createPaymentIntent = useCallback(async () => {
    try {
      const startTime = new Date();
      const { data } = await createStripePaymentIntent({
        amount: total, // amount in dollars
        name: fullName(order.people[0]),
        email: order.people[0].email,
        idempotencyKey: order.idempotencyKey
      });
      console.log('Stripe payment intent created in', new Date() - startTime, 'ms');
      setClientSecret(data.clientSecret);
      setLastUpdatedTotal(total);
      setReady(true);
    } catch (error) {
      console.error(error);
      setError(`We encountered an error initializing Stripe. Please try again or contact ${EMAIL_CONTACT}.`);
    }
  }, [total, order, setClientSecret, setError, setReady, setLastUpdatedTotal]);

  const updatePaymentIntent = useCallback(async () => {
    const startTime = new Date();
    if (!clientSecret) return;
    const paymentIntentId = clientSecret.split('_secret_')[0];
    try {
      await updateStripePaymentIntent({
        paymentIntentId,
        amount: total, // amount in dollars
      });
      console.log('Stripe payment intent updated in', new Date() - startTime, 'ms');
      setLastUpdatedTotal(total);
      setReady(true);
    } catch (error) {
      console.error(error);
      setError(`We encountered an error initializing Stripe. Please try again or contact ${EMAIL_CONTACT}.`);
    }
  }, [total, clientSecret, setError, setReady, setLastUpdatedTotal]);

  useEffect(() => {
    if (clientSecret && total === lastUpdatedTotal) {
      setReady(true);
    } else if (clientSecret) {
      updatePaymentIntent();
    } else {
      createPaymentIntent();
    }
  }, [createPaymentIntent, updatePaymentIntent, setReady, clientSecret, total, lastUpdatedTotal]);

  return (
    <>
      {SANDBOX_MODE &&
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '3rem', my: 2, backgroundColor: 'var(--color-error)' }}>
          Testing: 4242424242424242 / any future expiration / any cvc / any zip
        </Box>
      }

      {ready ?
        <Elements stripe={stripePromise} options={{ clientSecret }} key={clientSecret}>
          <StripeCheckoutForm
            processCheckout={processCheckout}
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
