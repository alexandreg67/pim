export type NotificationSeverity = 'success' | 'error' | 'warning' | 'info';

export interface NotificationOptions {
  duration?: number;
  keepOpen?: boolean;
}

export interface Notification {
  open: boolean;
  message: string;
  severity: NotificationSeverity;
  duration?: number;
  keepOpen?: boolean;
}
