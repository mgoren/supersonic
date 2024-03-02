'use strict';

import * as functions from 'firebase-functions';
import nodemailer from 'nodemailer';

// Firestore database collection
const CONFIG_DATA_COLLECTION = 'orders';

// Configure the email transport using Sendgrid with SMTP
const mailTransport = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
      user: "apikey",
      pass: functions.config().email.sendgrid_api_key
  }
});

export const sendEmailConfirmation = functions.firestore.document(`${CONFIG_DATA_COLLECTION}/{ITEM}`).onCreate(async (snap) => {
  const order = snap.data();

  for (let i = 0; i < order.people.length; i++) {
    const person = order.people[i];
    const receipt = i === 0 ? order.receipt : order.additionalPersonReceipt;
    const emailConfig = functions.config().email;
    let mailOptions = {
      from: emailConfig.from,
      to: person.email,
      subject: emailConfig.subject,
      html: receipt
    };
    if (emailConfig.reply_to) {
      mailOptions.replyTo = emailConfig.reply_to;
    }
    try {
      await mailTransport.sendMail(mailOptions);
      functions.logger.log(`Receipt sent to:`, person.email);
    } catch(error) {
      functions.logger.error('There was an error while sending the email confirmation:', error);
    }
  }

  return null;
});
