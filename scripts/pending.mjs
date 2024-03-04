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
import admin from 'firebase-admin';
import dotenv from 'dotenv';
dotenv.config();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL || process.env.REACT_APP_FIREBASE_DATABASE_URL,
});

const db = admin.database();
const pendingRef = db.ref('pendingOrders');
const ordersRef = db.ref('orders');

try {
  const pendingSnapshot = await pendingRef.once('value');
  const ordersSnapshot = await ordersRef.once('value');
  const pendingOrders = getOrders(pendingSnapshot);
  const orders = getOrders(ordersSnapshot);
    
  const pendingOrdersMissingFromOrders = pendingOrders.filter((pendingOrder) => {
    return !orders.some((order) => order.idempotencyKey === pendingOrder.idempotencyKey);
  });
  for (const order of pendingOrdersMissingFromOrders) {
    console.log(order.key, order.people[0].email);
  }
  if (pendingOrdersMissingFromOrders.length === 0) {
    console.log('\nNo pending orders missing from orders :)\n');
  }

} catch (error) {
  console.error(error);
} finally {
  admin.app().delete();
}

function getOrders(snapshot) {
  const orders = [];
  snapshot.forEach((childSnapshot) => {
    const key = childSnapshot.key;
    const childData = childSnapshot.val();
    orders.push({ key, ...childData });
  });
  return orders;
}
