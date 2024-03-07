import * as functions from "firebase-functions";
import admin from 'firebase-admin';
import stripeModule from "stripe";
import { handleError } from "./helpers.js";

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
  } catch (err) {
    handleError('An error occurred while creating the Stripe Payment Intent', {
      error: err.message,
      data: JSON.stringify(data)
    });
  }
});

export const updateStripePaymentIntent = functions.runWith({ enforceAppCheck: true }).https.onCall(async (data) => {
  const { paymentIntentId, amount } = data;
  try {
    await stripe.paymentIntents.update(paymentIntentId, {
      amount: amount * 100 // amount in cents
    });
    return { result: 'Stripe Payment Intent updated successfully' };
  } catch (err) {
    handleError('An error occurred while updating the Stripe Payment Intent', {
      error: err.message,
      data: JSON.stringify(data)
    });
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
