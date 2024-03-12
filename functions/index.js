import * as functions from 'firebase-functions';
import admin from 'firebase-admin';
import { savePendingOrder, saveFinalOrder } from './database.js';
import { sendEmailConfirmations } from './email-confirmation.js';
import { appendrecordtospreadsheet } from './google-sheet-sync.js';
import { createStripePaymentIntent as createStripeImport, updateStripePaymentIntent as updateStripeImport } from './stripe.js';

if (admin.apps.length === 0) admin.initializeApp();

let createStripePaymentIntent, updateStripePaymentIntent;
if (functions.config().stripe?.secret_key) {
  createStripePaymentIntent = createStripeImport;
  updateStripePaymentIntent = updateStripeImport;
}

export {
  savePendingOrder,
  saveFinalOrder,
  sendEmailConfirmations,
  appendrecordtospreadsheet,
  createStripePaymentIntent,
  updateStripePaymentIntent
};
