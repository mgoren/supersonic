'use strict';

import * as functions from 'firebase-functions';
import { google } from 'googleapis';
import admin from 'firebase-admin';
import { fieldOrder } from './fields.js';
import { handleError, joinArrays } from './helpers.js';

const ADMISSION_MINIMUM = parseInt(functions.config().shared.admission_min);
const SERVICE_ACCOUNT_KEYS = functions.config().sheets.googleapi_service_account;
const SHEET_ID = functions.config().sheets.sheet_id;
const CONFIG_DATA_COLLECTION = 'orders';
const RANGE = 'A:AP';
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 500;

if (admin.apps.length === 0) admin.initializeApp();
const client = new google.auth.JWT(SERVICE_ACCOUNT_KEYS.client_email, null, SERVICE_ACCOUNT_KEYS.private_key, ['https://www.googleapis.com/auth/spreadsheets']);


// ******** ADD LINE(S) TO SPREADSHEET ********

export const appendrecordtospreadsheet = functions.firestore.document(`${CONFIG_DATA_COLLECTION}/{ITEM}`).onCreate(async (snap) => {
  try {
    const order = { ...snap.data(), key: snap.id };
    const orders = mapOrderToSpreadsheetLines(order);
    const promises = orders.map(orderLine => appendPromise(orderLine));
    await Promise.all(promises);
  } catch (err) {
    handleError(`Error in appendrecordtospreadsheet for ${snap.data().people[0].email}`, err);
  }
});

const mapOrderToSpreadsheetLines = (order) => {
  const orders = []
  const createdAt = order.createdAt.toDate().toLocaleDateString();
  const updatedOrder = joinArrays(order);
  const { people, ...orderFields } = updatedOrder
  let isPurchaser = true;
  for (const person of people) {
    const admissionCost = parseInt(person.admissionCost);
    const admission = admissionCost >= ADMISSION_MINIMUM ? admissionCost : '';
    const deposit = admissionCost < ADMISSION_MINIMUM ? admissionCost : '';
    const total = isPurchaser ? admissionCost + order.donation : admissionCost;
    const address = person.apartment ? `${person.address} ${person.apartment}` : person.address;
    const updatedPerson = person.share ? joinArrays(person) : { ...joinArrays(person), share: 'do not share' };
    const paid = order.paymentMethod === 'check' ? 0 : total;
    let status = '';
    if (order.paymentMethod === 'check') {
      status = 'awaiting check';
    } else if (admissionCost < ADMISSION_MINIMUM) {
      status = 'deposit';
    } else {
      status = 'paid';
    }
    const firstPersonPurchaserField = people.length > 1 ? `self (+${people.length - 1})` : 'self';
    const personFieldsBuilder = {
      ...updatedPerson,
      createdAt,
      address,
      admissionCost: admission,
      deposit,
      total,
      paid,
      status,
      purchaser: isPurchaser ? firstPersonPurchaserField : `${people[0].first} ${people[0].last}`
    };
    const personFields = isPurchaser ? { ...orderFields, ...personFieldsBuilder } : personFieldsBuilder;
    const line = fieldOrder.map(field => personFields[field] || '');
    orders.push(line);
    isPurchaser = false;
  }
  return orders;
};

async function appendPromise(orderLine, attempt = 0) {
  try {
    return await googleSheetsOperation({
      operation: 'append',
      params: {
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        resource: {
          values: [orderLine]
        }
      }
    });
  } catch (err) {
    if (attempt < MAX_RETRIES) {
      const delay = RETRY_DELAY_MS * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
      return appendPromise(orderLine, attempt + 1);
    } else {
      handleError(`Error appending orderLine ${orderLine} to spreadsheet`, err);
    }
  }
}


// ******** GOOGLE SHEETS API ********

async function googleSheetsOperation({ operation, params }) {
  try {
    const operationParams = {
      ...params,
      spreadsheetId: SHEET_ID,
      range: params.range || RANGE
    };
    
    await client.authorize();
    const sheets = google.sheets({ version: 'v4', auth: client });

    switch (operation) {
      case 'read':
        return await sheets.spreadsheets.values.get(operationParams);
      case 'append':
        return await sheets.spreadsheets.values.append(operationParams);
      case 'update':
        return await sheets.spreadsheets.values.update(operationParams);
      default:
        throw new Error('Invalid operation');
    }
  } catch (err) {
    handleError(`Google Sheets API operation (${operation}) failed`, err);
  }
}
