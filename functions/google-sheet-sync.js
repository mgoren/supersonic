'use strict';

import * as functions from 'firebase-functions';
import { google } from 'googleapis';
import admin from 'firebase-admin';
import { fieldOrder } from './fields.js';

const ADMISSION_MINIMUM = parseInt(functions.config().shared.admission_min);
const SERVICE_ACCOUNT_KEYS = functions.config().sheets.googleapi_service_account;
const SHEET_ID = functions.config().sheets.sheet_id;
const PAYMENT_ID_COLUMN = functions.config().sheets.payment_id_column;
const PAID_COLUMN = functions.config().sheets.paid_column;
const STATUS_COLUMN = functions.config().sheets.status_column;
const DATA_PATH = '/orders';
const RANGE = 'A:AP';
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 500;

if (admin.apps.length === 0) admin.initializeApp();
const client = new google.auth.JWT(SERVICE_ACCOUNT_KEYS.client_email, null, SERVICE_ACCOUNT_KEYS.private_key, ['https://www.googleapis.com/auth/spreadsheets']);


// ******** ADD LINE(S) TO SPREADSHEET ********

export const appendrecordtospreadsheet = functions.database.ref(`${DATA_PATH}/{ITEM}`).onCreate(
  async (snap) => {
    try {
      const key = snap.key;
      const newRecord = snap.val();
      const orders = mapOrderToSpreadsheetLines({ ...newRecord, key });
      const promises = orders.map(orderLine => appendPromise(orderLine));
      await Promise.all(promises);
    } catch (err) {
      handleError(`Error in appendrecordtospreadsheet for ${snap.val().emailConfirmation}`, err);
    }
  }
);

const mapOrderToSpreadsheetLines = (order) => {
  const orders = []
  const createdAt = new Date(order.createdAt).toLocaleDateString();
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
    const firstPersonPurchaserField = people.length > 1 ? `self (+${people.length - 1})` : 'self';
    const personFieldsBuilder = {
      ...updatedPerson,
      createdAt,
      address,
      admissionCost: admission,
      deposit,
      total,
      paid: 'PENDING',
      status: 'PENDING',
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


// ******** UPDATE SPREADSHEET LINE ********

export const updaterecordinspreadsheet = functions.database.ref(`${DATA_PATH}/{ITEM}`).onUpdate(
  async (change) => {
    try {
      const key = change.after.key;
      const order = change.after.val();
      const paymentId = order.paymentId;
      const paid = order.paymentMethod === 'check' ? 0 : total;
      let status = '';
      if (order.paymentMethod === 'check') {
        status = 'awaiting check';
      } else if (admissionCost < ADMISSION_MINIMUM) {
        status = 'deposit';
      } else {
        status = 'paid';
      }
      const row = await findRowByKey({ key });
      if (row) {
        await updateSpreadsheetRow({ row, column: PAYMENT_ID_COLUMN, value: paymentId });
        await updateSpreadsheetRow({ row, column: PAID_COLUMN, value: paid });
        await updateSpreadsheetRow({ row, column: STATUS_COLUMN, value: status });
      }
    } catch (err) {
      handleError(`Error updating paymentId for key ${key}`, err);
    }
  }
);

async function findRowByKey({ key }) {
  try {
    const response = await googleSheetsOperation({ 
      operation: 'read',
      params: {}
    });
    const rows = response.data.values;
    if (rows.length) {
      for (let i = 0; i < rows.length; i++) {
        if (rows[i][0] === key) {
          return i + 1;
        }
      }
    }
    return null; // Key not found
  } catch (err) {
    handleError('Error in findRowByKey', err);
  }
}

async function updateSpreadsheetRow({ row, column, value }) {
  try {
    await googleSheetsOperation({ 
      operation: 'update',
      params: {
        range: `${column}${row}`,
        valueInputOption: 'USER_ENTERED',
        resource: { values: [[value]] }
      }
    });
  } catch (err) {
    handleError('Error in updateSpreadsheetRow', err);
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


// ******** HELPERS ********

const joinArrays = (obj) => {
  const newObj = { ...obj };
  for (let key in obj) {
    if (key !== 'people' && Array.isArray(obj[key])) {
      newObj[key] = obj[key].join(', ');
    }
  }
  return newObj;
};

function handleError(message, err) {
  functions.logger.error(message, err);
  throw err;
}
