import { Request, Response } from 'express';
import { createTransporter } from '../config/mail';
import { getEmailTemplate } from '../templates';
import nodemailer from 'nodemailer';

export class MailController {
  async sendMail(req: Request, res: Response) {
    try {
      const { to, template, data } = req.body;

      console.info('📧 Mail request received:', { to, template });

      // Vérifier les données requises
      if (!to || !template) {
        return res.status(400).json({
          error: 'Missing required parameters: to, template',
        });
      }

      const transporter = await createTransporter();

      // Configurer les options d'email
      const mailOptions = {
        from: {
          name: 'PIM Platform',
          address: process.env.SMTP_FROM || 'no-reply@pim.com',
        },
        to,
        subject: this.getSubjectForTemplate(template),
        html: getEmailTemplate(template, data),
      };

      // Envoyer l'email
      const info = await transporter.sendMail(mailOptions);

      // console.info('📨 Email sent:', {
      //   messageId: info.messageId,
      //   response: info.response,
      //   accepted: info.accepted || [],
      //   rejected: info.rejected || [],
      //   pending: info.pending || [],
      //   envelope: info.envelope,
      // });

      return res.json({
        success: true,
        messageId: info.messageId,
        ...(process.env.NODE_ENV === 'development' && {
          preview: nodemailer.getTestMessageUrl(info),
        }),
      });
    } catch (error: unknown) {
      console.error('❌ Mail sending error:', error);

      if (error instanceof Error && 'response' in error) {
        console.error(
          '📩 SMTP Response:',
          (error as Error & { response: unknown }).response
        );
      }

      return res.status(500).json({
        error: 'Failed to send email',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  private getSubjectForTemplate(template: string): string {
    const subjects: Record<string, string> = {
      TEMP_PASSWORD: 'Votre compte PIM a été créé',
      PASSWORD_CHANGED: 'Confirmation de changement de mot de passe',
      DEFAULT: 'Message de PIM Platform',
    };
    return subjects[template.toUpperCase()] || subjects.DEFAULT;
  }

  async healthCheck(req: Request, res: Response) {
    try {
      const transporter = await createTransporter();
      await transporter.verify();
      res.json({ status: 'healthy', smtp: true });
    } catch (error) {
      res.status(500).json({
        status: 'unhealthy',
        smtp: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}

export const mailController = new MailController();
