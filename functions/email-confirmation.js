'use strict';

import * as functions from 'firebase-functions';
import nodemailer from 'nodemailer';

// Configure the email transport using Sendgrid with SMTP
const mailTransport = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
      user: "apikey",
      pass: functions.config().email.sendgrid_api_key
  }
});

// errors are handled in the calling function
export const sendEmailConfirmations = async (emailReceiptPairs) => {
  for (const {email, receipt}  of emailReceiptPairs) {
    const emailConfig = functions.config().email;
    let mailOptions = {
      from: emailConfig.from,
      to: email,
      subject: emailConfig.subject,
      html: receipt,
      ...(emailConfig.reply_to && {replyTo: emailConfig.reply_to})
    };
    await mailTransport.sendMail(mailOptions);
    functions.logger.log(`Receipt sent to:`, email);
  }
};
