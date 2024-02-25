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

export const createOrder = functions.https.onCall(async (data) => {
  const { token, action, order } = data;
  authenticate(token);
  const filteredOrder = filterObject(order, validFields);
  const updatedOrder = {
    ...filteredOrder,
    createdAt: admin.database.ServerValue.TIMESTAMP
  };
  try {
    const newOrderRef = admin.database().ref(action === ActionType.UPDATE ? 'orders/' : 'pendingOrders/').push();
    await newOrderRef.set(updatedOrder);
    if (action === ActionType.UPDATE) {
      await admin.database().ref(`pendingOrders/${order.id}`).remove();
    }
    return { id: newOrderRef.key };
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

const authenticate = (token) => {
  if (token.trim() !== functions.config().shared.token.trim()) {
    handleError('permission-denied', 'The function must be called with a valid token.');
  }
}
