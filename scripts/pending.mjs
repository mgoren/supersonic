// Description: This script checks for pending orders that are missing from the orders collection
//
// Configuration:
//   - Set the service account key in the firebase-service-key.json file
//     - Generate new private key from project settings service accounts
//       (https://console.firebase.google.com/project/[PROJECT_ID]/settings/serviceaccounts/adminsdk)
//     - Rename to `firebase-service-key.json`
//     - Confirm it is not added to git!
//
// Usage: npm run pending

import serviceAccount from '../firebase-service-key.json' assert { type: 'json' };
import { initializeApp, cert, deleteApp, getApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

initializeApp({ credential: cert(serviceAccount) });
const firestore = getFirestore();

const PENDING_ORDERS_DB = 'pendingOrders';
const ORDERS_DB = 'orders';

try {
  const pendingOrders = getOrders(await firestore.collection(PENDING_ORDERS_DB).get());
  const orders = getOrders(await firestore.collection(ORDERS_DB).get());
  
  const pendingOrdersMissingFromOrders = pendingOrders.filter((pendingOrder) => {
    return !orders.some((order) => order.idempotencyKey === pendingOrder.idempotencyKey);
  });

  console.log(pendingOrdersMissingFromOrders.length === 0 ? '\nNo pending orders missing from orders :)' : '\nPending orders missing from orders:\n');
  for (const order of pendingOrdersMissingFromOrders) {
    console.log(order.key, order.people[0].email);
  }
  console.log('');

} catch (error) {
  console.error(error);
} finally {
  deleteApp(getApp());
}

function getOrders(snapshot) {
  const orders = [];
  for (const doc of snapshot.docs) {
    orders.push({ key: doc.id, ...doc.data() });
  }
  return orders;
}
