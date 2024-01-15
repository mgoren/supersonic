import * as functions from "firebase-functions";
import admin from 'firebase-admin';
import stripeModule from "stripe";

const stripe = stripeModule(functions.config().stripe.secret_key);

if (admin.apps.length === 0) {
  admin.initializeApp();
}

export const createStripePaymentIntent = functions.https.onCall(async (data) => {
  const { token, amount, name, email } = data;
  if (token.trim() !== functions.config().shared.token.trim()) {
    throw new functions.https.HttpsError('permission-denied', 'The function must be called with a valid token.');
  }
  let customer;
  const existingCustomers = await stripe.customers.list({ email, limit: 1 });
  if (existingCustomers.data.length) {
    customer = existingCustomers.data[0].id;
  } else {
    const newCustomer = await stripe.customers.create({ name, email });
    customer = newCustomer.id;
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // amount in cents
      currency: "usd",
      customer
    });
    return { clientSecret: paymentIntent.client_secret };
  } catch (error) {
    throw new functions.https.HttpsError('internal', 'Server error', error);
  }
});

export const updateStripePaymentIntent = functions.https.onCall(async (data) => {
  const { token, clientSecret, amount } = data;
  if (token.trim() !== functions.config().shared.token.trim()) {
    throw new functions.https.HttpsError('permission-denied', 'The function must be called with a valid token.');
  }
  try {
    await stripe.paymentIntents.update(clientSecret, {
      amount: amount * 100 // amount in cents
    });
    return { result: 'Stripe Payment Intent updated successfully' };
  } catch (error) {
    throw new functions.https.HttpsError('internal', 'Server error', error);
  }
});

export const cancelStripePaymentIntent = functions.https.onCall(async (data) => {
  const { token, paymentIntentId } = data;
  if (token.trim() !== functions.config().shared.token.trim()) {
    throw new functions.https.HttpsError('permission-denied', 'The function must be called with a valid token.');
  }
  try {
    const paymentIntent = await stripe.paymentIntents.cancel(paymentIntentId);
    return { paymentIntent };
  } catch (error) {
    throw new functions.https.HttpsError('internal', 'Server error', error);
  }
});
