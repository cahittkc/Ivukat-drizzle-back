// routes/email.ts
import { sendMail } from '../services/emailService';
import { Router } from 'express';

const router = Router();

router.post('/send-email', async (req, res) => {
  const { to, subject, html } = req.body;

  const success = await sendMail(to, subject, html);

  if (success) {
    res.status(200).json({ message: 'Email sent!' });
  } else {
    res.status(500).json({ message: 'Failed to send email.' });
  }
});

export default router;
