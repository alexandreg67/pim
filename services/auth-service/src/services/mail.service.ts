// auth-service/src/services/mail.service.ts
import axios from 'axios';
import { MailOptions, MailResponse } from '../types/mail.types';
import { AppError } from '../utils/error.util';

export class MailService {
  private static mailServiceUrl: string = 'http://mail:3002/mail';

  static async sendMail(options: MailOptions): Promise<MailResponse> {
    try {
      const response = await axios.post<MailResponse>(
        `${this.mailServiceUrl}/send`,
        options
      );

      if (!response.data.success) {
        throw new AppError('Mail service returned unsuccessful response', 500);
      }

      // Log en dev pour faciliter les tests
      if (process.env.NODE_ENV === 'development') {
        console.info('Email preview URL:', response.data.previewUrl);
      }

      return response.data;
    } catch (error) {
      console.error(`Failed to send ${options.template} email:`, error);

      if (process.env.NODE_ENV === 'production') {
        throw new AppError('Failed to send email', 500);
      }

      // En dev, on retourne un faux succès pour ne pas bloquer le flow
      return {
        success: true,
        messageId: 'dev-mode',
        previewUrl: 'https://ethereal.email',
      };
    }
  }

  static async checkHealth(): Promise<{
    status: 'healthy' | 'unhealthy';
    details?: string;
  }> {
    try {
      await axios.get(`${this.mailServiceUrl}/health`, {
        timeout: 2000,
      });
      return { status: 'healthy' };
    } catch (error) {
      return {
        status: 'unhealthy',
        details: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
