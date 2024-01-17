import * as functions from "firebase-functions";
import admin from 'firebase-admin';

if (admin.apps.length === 0) {
  admin.initializeApp();
}

export const createOrder = functions.https.onCall(async (data) => {
  const { token, order } = data;
  if (token.trim() !== functions.config().shared.token.trim()) {
    throw new functions.https.HttpsError('permission-denied', 'The function must be called with a valid token.');
  }
  const updatedOrder = { ...order, createdAt: admin.database.ServerValue.TIMESTAMP };
  try {
    const newOrderRef = admin.database().ref('orders/').push();
    await newOrderRef.set(updatedOrder);
    return { id: newOrderRef.key };
  } catch (error) {
    throw new functions.https.HttpsError('unknown', 'An error occurred while creating the order', error);
  }
});

export const updateOrder = functions.https.onCall(async (data) => {
  const { token, id, updates } = data;
  if (token.trim() !== functions.config().shared.token.trim()) {
    throw new functions.https.HttpsError('permission-denied', 'The function must be called with a valid token.');
  }
  const filteredUpdates = { paymentId: updates.paymentId };
  if (!id || id === '') {
    throw new functions.https.HttpsError('invalid-argument', 'The function must be called with a valid order ID.')
  }
  try {
    const orderRef = admin.database().ref(`orders/${id}`);
    await orderRef.update(filteredUpdates);
    return { result: `Order ${id} updated` };
  } catch (error) {
    throw new functions.https.HttpsError('unknown', 'An error occurred while updating the order', error);
  }
});
