// errors are handled in the calling function
import * as functions from "firebase-functions";
import stripeModule from "stripe";

const stripe = stripeModule(functions.config().stripe.secret_key);
const statement_descriptor_suffix = functions.config().stripe.statement_descriptor_suffix; // appended to statement descriptor set in Stripe dashboard

export const createStripePaymentIntent = async ({ email, name, amount, idempotencyKey }) => {
  const customer = await findOrCreateCustomer(email, name);
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
};

export const updateStripePaymentIntent = async ({ paymentIntentId, amount }) => {
  await stripe.paymentIntents.update(paymentIntentId, {
    amount: amount * 100 // amount in cents
  });
  return { result: 'Stripe Payment Intent updated successfully' };
};

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
