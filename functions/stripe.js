import * as functions from "firebase-functions";
import admin from 'firebase-admin';
import stripeModule from "stripe";

const stripe = stripeModule(functions.config().stripe.secret_key);
const statement_descriptor_suffix = functions.config().stripe.statement_descriptor_suffix; // appended to statement descriptor set in Stripe dashboard

if (admin.apps.length === 0) {
  admin.initializeApp();
}

export const createStripePaymentIntent = functions.runWith({ enforceAppCheck: true }).https.onCall(async (data) => {
  const { email, name, amount, idempotencyKey } = data;
  const customer = await findOrCreateCustomer(email, name);
  try {
    const paymentIntent = await stripe.paymentIntents.create(
      {
        amount: amount * 100, // amount in cents
        currency: "usd",
        customer,
        statement_descriptor_suffix
      },
      { idempotencyKey }
    );
    return { clientSecret: paymentIntent.client_secret };
  } catch (error) {
    throw new functions.https.HttpsError('internal', 'Server error', error);
  }
});

export const updateStripePaymentIntent = functions.runWith({ enforceAppCheck: true }).https.onCall(async (data) => {
  const { clientSecret, amount } = data;
  try {
    await stripe.paymentIntents.update(clientSecret, {
      amount: amount * 100 // amount in cents
    });
    return { result: 'Stripe Payment Intent updated successfully' };
  } catch (error) {
    throw new functions.https.HttpsError('internal', 'Server error', error);
  }
});

export const cancelStripePaymentIntent = functions.runWith({ enforceAppCheck: true }).https.onCall(async (data) => {
  const { paymentIntentId } = data;
  try {
    const paymentIntent = await stripe.paymentIntents.cancel(paymentIntentId);
    return { paymentIntent };
  } catch (error) {
    throw new functions.https.HttpsError('internal', 'Server error', error);
  }
});

async function findOrCreateCustomer(email, name) {
  let customer;
  const existingCustomers = await stripe.customers.list({ email, limit: 1 });
  if (existingCustomers.data.length) {
    customer = existingCustomers.data[0].id;
  } else {
    const newCustomer = await stripe.customers.create({ name, email });
    customer = newCustomer.id;
  }
  return customer;
}
