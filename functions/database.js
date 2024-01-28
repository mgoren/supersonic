import * as functions from "firebase-functions";
import admin from 'firebase-admin';
import { validFields } from './fields.js';

if (admin.apps.length === 0) {
  admin.initializeApp();
}

export const createOrder = functions.https.onCall(async (data) => {
  const { token, order } = data;
  if (token.trim() !== functions.config().shared.token.trim()) {
    throw new functions.https.HttpsError('permission-denied', 'The function must be called with a valid token.');
  }
  const filteredOrder = filterObject(order, validFields);
  const updatedOrder = { ...filteredOrder, createdAt: admin.database.ServerValue.TIMESTAMP };
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

// helper function to filter out any fields that aren't in the validFields array
const filterObject = (originalObj, validFields) => validFields.reduce((newObj, key) => {
  if (key in originalObj) {
    const value = originalObj[key];
    if (Array.isArray(value)) {
      newObj[key] = value.map(item => (item && typeof item === 'object') ? filterObject(item, validFields) : item);
    } else if (value && typeof value === 'object') {
      newObj[key] = filterObject(value, validFields);
    } else {
      newObj[key] = value;
    }
  }
  return newObj;
}, {});
