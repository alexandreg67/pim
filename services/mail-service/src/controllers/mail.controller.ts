import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import { getEmailTemplate } from '../templates';

export class MailController {
  private async createTestAccount() {
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }

  async sendMail(req: Request, res: Response) {
    try {
      const { template, to, data } = req.body;

      // Créer un compte de test Ethereal
      const transporter = await this.createTestAccount();

      // Obtenir le template HTML
      const html = getEmailTemplate(template, data);

      // Envoyer l'email
      const info = await transporter.sendMail({
        from: '"PIM Admin" <admin@pim.com>',
        to,
        subject: this.getSubjectForTemplate(template),
        html,
      });

      // Obtenir l'URL de prévisualisation Ethereal
      const previewUrl = nodemailer.getTestMessageUrl(info);

      return res.json({
        success: true,
        messageId: info.messageId,
        previewUrl,
      });
    } catch (error) {
      console.error('Mail sending error:', error);
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
    };
    return subjects[template] || 'Message from PIM';
  }
}
