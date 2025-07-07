// services/emailService.ts
import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export const sendMail = async (to: string, subject: string, html: string) => {
  const msg = {
    to,
    from: process.env.FROM_EMAIL!, // SendGrid'de verified olmalı
    subject,
    html,
  };

  try {
    await sgMail.send(msg);
    console.log('Email sent');
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};
