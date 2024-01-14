'use strict';

import * as functions from 'firebase-functions';
import { google } from 'googleapis';
import admin from 'firebase-admin';
import { mapOrderToSpreadsheetLines } from './fields.js';

const SERVICE_ACCOUNT_KEYS = functions.config().googleapi.service_account;
const SHEET_ID = functions.config().googleapi.sheet_id;
const DATA_PATH = '/orders';
const RANGE = 'A:AP';
const ELECTRONIC_PAYMENT_ID_COLUMN = 'AA';

if (admin.apps.length === 0) {
  admin.initializeApp();
}

const client = new google.auth.JWT(SERVICE_ACCOUNT_KEYS.client_email, null, SERVICE_ACCOUNT_KEYS.private_key, ['https://www.googleapis.com/auth/spreadsheets']);

export const appendrecordtospreadsheet = functions.database.ref(`${DATA_PATH}/{ITEM}`).onCreate(
  async (snap) => {
    try {
      const key = snap.key;
      const newRecord = snap.val();
      const orders = mapOrderToSpreadsheetLines({ ...newRecord, key });
      const promises = orders.map(orderLine => appendPromise(orderLine));
      await Promise.all(promises);
    } catch (err) {
      handleError(`Error in appendrecordtospreadsheet for ${newRecord.emailConfirmation}`, err);
    }
  }
);

async function appendPromise(orderLine) {
  return googleSheetsOperation({
    operation: 'append',
    params: {
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      resource: {
        values: [orderLine]
      }
    }
  });
}

export const updaterecordinspreadsheet = functions.database.ref(`${DATA_PATH}/{ITEM}`).onUpdate(
  async (change) => {
    try {
      const key = change.after.key;
      const record = change.after.val();
      const electronicPaymentId = record.electronicPaymentId;
      const rowToUpdate = await findRowByKey({ key });
      if (rowToUpdate) {
        await updateSpreadsheetRow({ row: rowToUpdate, value: electronicPaymentId });
      }
    } catch (err) {
      handleError(`Error updating electronicPaymentId for key ${key}`, err);
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

async function updateSpreadsheetRow({ row, value }) {
  try {
    await googleSheetsOperation({ 
      operation: 'update',
      params: {
        range: `${ELECTRONIC_PAYMENT_ID_COLUMN}${row}`,
        valueInputOption: 'USER_ENTERED',
        resource: { values: [[value]] }
      }
    });
  } catch (err) {
    handleError('Error in updateSpreadsheetRow', err);
  }
}

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

function handleError(message, err) {
  functions.logger.error(message, err);
  throw err;
}
