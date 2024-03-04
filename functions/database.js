import * as functions from "firebase-functions";
import admin from 'firebase-admin';
import { validFields } from './fields.js';
import { handleError } from './helpers.js';

const ActionType = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE'
};

if (admin.apps.length === 0) {
  admin.initializeApp();
}

export const createOrUpdateOrder = functions.runWith({ enforceAppCheck: true }).https.onCall(async (data) => {
  const { action, order } = data;
  const createdAt = admin.firestore.FieldValue.serverTimestamp();
  const filteredOrder = filterObject(order, validFields);
  const updatedOrder = { ...filteredOrder, createdAt };
  try {
    const pendingCollection = admin.firestore().collection('pendingOrders');
    const ordersCollection = admin.firestore().collection('orders');
    let orderRef;
    if (action === ActionType.CREATE) {
      const { idempotencyKey } = updatedOrder;
      const existingOrder = await pendingCollection.where('idempotencyKey', '==', idempotencyKey).get();
      orderRef = existingOrder.empty ? await pendingCollection.add(updatedOrder) : pendingCollection.doc(existingOrder.docs[0].id);
    } else if (action === ActionType.UPDATE) {
      orderRef = ordersCollection.doc(order.id);
      await orderRef.set(updatedOrder);
      await pendingCollection.doc(order.id).delete();
    }
    return { id: orderRef.id };
  } catch (err) {
    handleError(`An error occurred while ${action === ActionType.UPDATE ? 'updating' : 'creating' } the order`, err);
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
