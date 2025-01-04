import { Transporter } from 'nodemailer';

declare global {
  namespace Express {
    interface Request {
      mailer?: Transporter;
    }
  }
}
