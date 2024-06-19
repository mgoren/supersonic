// errors are handled in the calling function
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { validFields } from './fields.js';
const firestore = getFirestore();

// client does not await execution, so not returning anything
export const savePendingOrder = async (order) => {
  const filteredOrder = filterObject(order, validFields);
  const orderWithTimestamp = { ...filteredOrder, createdAt: FieldValue.serverTimestamp() };
  const pendingCollection = firestore.collection('pendingOrders');
  const existingOrder = await pendingCollection.where('idempotencyKey', '==', order.idempotencyKey).get();
  if (existingOrder.empty) {
    await pendingCollection.add(orderWithTimestamp);
  } else {
    await pendingCollection.doc(existingOrder.docs[0].id).set(orderWithTimestamp);
  }
};

export const saveFinalOrder = async (order) => {
  const filteredOrder = filterObject(order, validFields);
  const orderWithTimestamp = { ...filteredOrder, createdAt: FieldValue.serverTimestamp() };
  const ordersCollection = firestore.collection('orders');
  await ordersCollection.add(orderWithTimestamp);
  return { status: 'success' };
};

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
