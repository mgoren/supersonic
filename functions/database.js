import * as functions from "firebase-functions";
import admin from 'firebase-admin';
import { validFields } from './fields.js';
import { handleError } from './helpers.js';

if (admin.apps.length === 0) {
  admin.initializeApp();
}

// client does not await execution, so not returning anything
export const savePendingOrder = functions.runWith({ enforceAppCheck: true }).https.onCall(async (order) => {
  const filteredOrder = filterObject(order, validFields);
  const orderWithTimestamp = { ...filteredOrder, createdAt: admin.firestore.FieldValue.serverTimestamp() };
  try {
    const pendingCollection = admin.firestore().collection('pendingOrders');
    const existingOrder = await pendingCollection.where('idempotencyKey', '==', order.idempotencyKey).get();
    if (existingOrder.empty) {
      await pendingCollection.add(orderWithTimestamp);
    } else {
      await pendingCollection.doc(existingOrder.docs[0].id).set(orderWithTimestamp);
    }
  } catch (err) {
    handleError('An error occurred while saving the pending order', {
      error: err.message,
      order: JSON.stringify(order)
    });
  }
});

export const saveFinalOrder = functions.runWith({ enforceAppCheck: true }).https.onCall(async (order) => {
  const filteredOrder = filterObject(order, validFields);
  const orderWithTimestamp = { ...filteredOrder, createdAt: admin.firestore.FieldValue.serverTimestamp() };
  try {
    const ordersCollection = admin.firestore().collection('orders');
    await ordersCollection.add(orderWithTimestamp);
  } catch (err) {
    handleError('An error occurred while saving the final order!', {
      error: err.message,
      order: JSON.stringify(order)
    });
  }
  return { status: 'success' };
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
