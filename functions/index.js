import * as functions from 'firebase-functions';
import admin from 'firebase-admin';
import { handleError } from './helpers.js';
import { appendrecordtospreadsheet } from './google-sheet-sync.js';
import { savePendingOrder, saveFinalOrder } from './database.js';
import { sendEmailConfirmations } from './email-confirmation.js';
import { createStripePaymentIntent as createStripeImport, updateStripePaymentIntent as updateStripeImport } from './stripe.js';

if (admin.apps.length === 0) admin.initializeApp();

let createStripePaymentIntent, updateStripePaymentIntent;
if (functions.config().stripe?.secret_key) {
  createStripePaymentIntent = createStripeImport;
  updateStripePaymentIntent = updateStripeImport;
}

// combining into one callable function to reduce slow cold start preflight checks
export const firebaseFunctionDispatcher = functions.runWith({ enforceAppCheck: true }).https.onCall(async ({ action, data }) => {
  try {
    switch(action) {
      case 'caffeinate': return { status: 'awake' };
      case 'createStripePaymentIntent': return await createStripePaymentIntent(data);
      case 'updateStripePaymentIntent': return await updateStripePaymentIntent(data);
      case 'savePendingOrder': return await savePendingOrder(data);
      case 'saveFinalOrder': return await saveFinalOrder(data);
      case 'sendEmailConfirmations': return await sendEmailConfirmations(data);
      default: return { error: 'Invalid action' };
    }
  } catch (err) {
    handleError(`An error occurred in ${action}`, {error: err.message, data: JSON.stringify(data)});
  }
});

export { appendrecordtospreadsheet };
