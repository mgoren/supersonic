import { useState, useEffect, useRef, useCallback } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import Loading from 'components/Loading';
import { Box } from '@mui/material';
import StripeCheckoutForm from 'components/StripeCheckoutForm';
import config from 'config';
const { SANDBOX_MODE, PAYMENT_METHODS } = config;
const functions = getFunctions();
const createStripePaymentIntent = httpsCallable(functions, 'createStripePaymentIntent');
const cancelStripePaymentIntent = httpsCallable(functions, 'cancelStripePaymentIntent');
const stripePromise = PAYMENT_METHODS.includes('stripe') ? await loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY) : null;

export default function StripeCheckoutWrapper({ total, name, email, processing, setProcessing, setError, saveOrderToFirebase, setOrder }) {
  const [clientSecret, setClientSecret] = useState(null);
  const clientSecretRef = useRef(null);

  const createPaymentIntent = useCallback(async () => {
    try {
      const { data } = await createStripePaymentIntent({
        amount: total, // amount in dollars
        name,
        email
      });
      setClientSecret(data.clientSecret);
    } catch (error) {
      console.error(error);
    }
  }, [total, name, email]);
  
  const cancelPaymentIntent = async () => {
    const paymentIntentId = clientSecretRef.current.split('_secret_')[0];
    try {
      const { data } = await cancelStripePaymentIntent({ paymentIntentId });
      setClientSecret(data.clientSecret);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    createPaymentIntent();
    return () => {
      if (clientSecretRef.current) {
        cancelPaymentIntent();
      }
    };
  }, [createPaymentIntent]);

  useEffect(() => {
    clientSecretRef.current = clientSecret;
  }, [clientSecret]);  

  let options = {
    clientSecret: clientSecret
  };
  
  return (
    <>
      {SANDBOX_MODE &&
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '3rem', my: 2, backgroundColor: 'var(--color-error)' }}>
          Testing: 4242424242424242 / any future expiration / any cvc / any zip
        </Box>
      }

      {clientSecret ?
        <Elements stripe={stripePromise} options={options} key={clientSecret}>
          <StripeCheckoutForm
            setError={setError}
            processing={processing} setProcessing={setProcessing}
            clientSecretRef={clientSecretRef}
            saveOrderToFirebase={saveOrderToFirebase}
            setOrder={setOrder}
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
