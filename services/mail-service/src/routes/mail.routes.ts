import express, { Request, Response } from 'express';
import { MailController } from '../controllers/mail.controller';

const controller = new MailController();

// router.post('/send', controller.sendMail.bind(controller));

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ status: 'Mail service is running' });
});

router.post('/send', async (req: Request, res: Response) => {
  try {
    const result = await controller.sendMail(req, res);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to send email',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export const mailRoutes = router;
