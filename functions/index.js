import { onCall } from 'firebase-functions/v2/https';
import { initializeApp, getApps } from 'firebase-admin/app';
import { handleError } from './helpers.js';
import { appendrecordtospreadsheet } from './google-sheet-sync.js';
import { savePendingOrder, saveFinalOrder } from './database.js';
import { sendEmailConfirmations } from './email-confirmation.js';
import { getStripePaymentIntent as stripeImport } from './stripe.js';
const getStripePaymentIntent = process.env.STRIPE_SECRET_KEY ? stripeImport : undefined;

if (!getApps().length) initializeApp();

// combining into one callable function to reduce slow cold start preflight checks
export const firebaseFunctionDispatcher = onCall({ enforceAppCheck: true }, async (request) => {
  const { action, data } = request.data;
  try {
    switch(action) {
      case 'caffeinate': return { status: 'awake' };
      case 'getStripePaymentIntent': return await getStripePaymentIntent(data);
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
