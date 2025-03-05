// auth-service/src/services/mail.service.ts
import axios from 'axios';
import { MailOptions, MailResponse } from '../types/mail.types';

export class MailService {
  private static mailServiceUrl: string = 'http://mail:3002/mail';

  static async sendMail(options: MailOptions): Promise<MailResponse> {
    try {
      const response = await axios.post<MailResponse>(
        `${this.mailServiceUrl}/send`,
        options
      );

      if (!response.data.success) {
        console.error(
          `Mail service returned unsuccessful response for ${options.template}`
        );
        // En production, on log l'erreur mais on ne bloque pas le processus
        return {
          success: false,
          messageId: '',
          errorMessage: 'Mail service returned unsuccessful response',
        };
      }

      return response.data;
    } catch (error) {
      console.error(`Failed to send ${options.template} email:`, error);

      // En production, on log l'erreur mais on ne bloque pas le processus
      return {
        success: false,
        messageId: '',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
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
