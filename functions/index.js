import * as functions from 'firebase-functions';
import admin from 'firebase-admin';
import { sendEmailConfirmation } from './email-confirmation.js';
import { createOrUpdateOrder } from './database.js';
import { appendrecordtospreadsheet } from './google-sheet-sync.js';
import {
  createStripePaymentIntent as createStripePaymentIntentOriginal,
  updateStripePaymentIntent as updateStripePaymentIntentOriginal,
} from './stripe.js';

if (admin.apps.length === 0) {
  admin.initializeApp();
}

export { createOrUpdateOrder, sendEmailConfirmation, appendrecordtospreadsheet };

let createStripePaymentIntent, updateStripePaymentIntent;
if (functions.config().stripe?.secret_key) {
  createStripePaymentIntent = createStripePaymentIntentOriginal;
  updateStripePaymentIntent = updateStripePaymentIntentOriginal;
}
export { createStripePaymentIntent, updateStripePaymentIntent };
