import axios from 'axios';

export class MailService {
  private mailServiceUrl: string;

  constructor() {
    // L'URL est définie par le nom du service dans docker-compose
    this.mailServiceUrl = 'http://mail-service:3002';
  }

  async sendTemporaryPassword(to: string, temporaryPassword: string) {
    try {
      await axios.post(`${this.mailServiceUrl}/mail/send`, {
        template: 'TEMP_PASSWORD',
        to,
        data: {
          temporaryPassword,
        },
      });
    } catch (error) {
      console.error('Failed to send temporary password email:', error);
      // En dev, on ne bloque pas le flow si l'envoi échoue
      if (process.env.NODE_ENV === 'production') {
        throw error;
      }
    }
  }

  async sendPasswordChangeConfirmation(to: string) {
    try {
      await axios.post(`${this.mailServiceUrl}/mail/send`, {
        template: 'PASSWORD_CHANGED',
        to,
        data: {},
      });
    } catch (error) {
      console.error('Failed to send password change confirmation:', error);
      if (process.env.NODE_ENV === 'production') {
        throw error;
      }
    }
  }
}
