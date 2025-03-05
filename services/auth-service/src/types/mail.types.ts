export interface MailOptions {
  to: string;
  template: 'TEMP_PASSWORD' | 'PASSWORD_CHANGED';
  data: Record<string, unknown>;
}

export interface MailResponse {
  success: boolean;
  messageId: string;
  errorMessage?: string;
}
