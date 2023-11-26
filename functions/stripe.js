import * as functions from "firebase-functions";
import cors from 'cors';
import stripeModule from "stripe";

const stripe = stripeModule(functions.config().stripe.secret_key);
const siteUrl = functions.config().stripe.site_url;
const allowedOrigin = process.env.FUNCTIONS_EMULATOR ? "http://localhost:3000" : siteUrl;

export const createStripePaymentIntent = functions.https.onRequest((req, res) => {
  cors({ origin: allowedOrigin })(req, res, async () => {
    if (req.method === "POST") {
      const { amount, name, email } = req.body;

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
        res.status(200).json({ clientSecret: paymentIntent.client_secret });
      } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
      }

    } else {
      res.set('Allow', 'POST');
      res.status(405).send('Method Not Allowed');
    }
  });
});

export const cancelStripePaymentIntent = functions.https.onRequest((req, res) => {
  cors({ origin: allowedOrigin })(req, res, async () => {
    if (req.method === "POST") {
      const { paymentIntentId } = req.body;
      try {
        const paymentIntent = await stripe.paymentIntents.cancel(paymentIntentId);
        res.status(200).json({ paymentIntent });
      } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
      }
    } else {
      res.set('Allow', 'POST');
      res.status(405).send('Method Not Allowed');
    }
  });
});
