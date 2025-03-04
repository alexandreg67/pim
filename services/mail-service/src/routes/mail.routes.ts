import express, { Request, Response } from 'express';
import { MailController } from '../controllers/mail.controller';
import { createTransporter } from '../config/mail';

const controller = new MailController();

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ status: 'Mail service is running' });
});

router.post('/send', async (req: Request, res: Response) => {
  try {
    await controller.sendMail(req, res);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to send email',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

router.get('/smtp-health', async (req, res) => {
  try {
    const transporter = await createTransporter();
    await transporter.verify();
    res.json({ status: 'SMTP connection successful' });
  } catch (error) {
    res
      .status(500)
      .json({
        status: 'SMTP connection failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
  }
});

export const mailRoutes = router;
