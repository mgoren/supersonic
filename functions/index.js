import * as functions from 'firebase-functions';
import admin from 'firebase-admin';
import { sendEmailConfirmation } from './email-confirmation.js';
import { createOrder } from './database.js';
import { appendrecordtospreadsheet } from './google-sheet-sync.js';
import {
  createStripePaymentIntent as createStripePaymentIntentOriginal,
  updateStripePaymentIntent as updateStripePaymentIntentOriginal,
  cancelStripePaymentIntent as cancelStripePaymentIntentOriginal
} from './stripe.js';

if (admin.apps.length === 0) {
  admin.initializeApp();
}

export { sendEmailConfirmation, createOrder, appendrecordtospreadsheet };

let createStripePaymentIntent, updateStripePaymentIntent, cancelStripePaymentIntent;
if (functions.config().stripe?.secret_key) {
  createStripePaymentIntent = createStripePaymentIntentOriginal;
  updateStripePaymentIntent = updateStripePaymentIntentOriginal;
  cancelStripePaymentIntent = cancelStripePaymentIntentOriginal;
}
export { createStripePaymentIntent, updateStripePaymentIntent, cancelStripePaymentIntent };
