import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { Snackbar, Alert } from '@mui/material';
import {
  Notification,
  NotificationSeverity,
  NotificationOptions,
} from '../../types/notification';

interface NotificationContextType {
  notify: (
    message: string,
    severity: NotificationSeverity,
    options?: NotificationOptions
  ) => void;
  success: (message: string, options?: NotificationOptions) => void;
  error: (message: string, options?: NotificationOptions) => void;
  warning: (message: string, options?: NotificationOptions) => void;
  info: (message: string, options?: NotificationOptions) => void;
}

const DEFAULT_SUCCESS_DURATION = 3000; // 3 secondes
const DEFAULT_ERROR_DURATION = undefined; // Pas de fermeture automatique

export const NotificationContext = createContext<
  NotificationContextType | undefined
>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [notification, setNotification] = useState<Notification>({
    open: false,
    message: '',
    severity: 'info',
    duration: DEFAULT_SUCCESS_DURATION,
    keepOpen: false,
  });

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotification((prev) => ({ ...prev, open: false }));
  };

  const notify = useCallback(
    (
      message: string,
      severity: NotificationSeverity,
      options?: NotificationOptions
    ) => {
      const duration =
        options?.duration ??
        (severity === 'error'
          ? DEFAULT_ERROR_DURATION
          : DEFAULT_SUCCESS_DURATION);

      setNotification({
        open: true,
        message,
        severity,
        duration,
        keepOpen: options?.keepOpen || severity === 'error',
      });
    },
    []
  );

  const success = useCallback(
    (message: string, options?: NotificationOptions) => {
      notify(message, 'success', options);
    },
    [notify]
  );

  const error = useCallback(
    (message: string, options?: NotificationOptions) => {
      notify(message, 'error', { keepOpen: true, ...options });
    },
    [notify]
  );

  const warning = useCallback(
    (message: string, options?: NotificationOptions) => {
      notify(message, 'warning', options);
    },
    [notify]
  );

  const info = useCallback(
    (message: string, options?: NotificationOptions) => {
      notify(message, 'info', options);
    },
    [notify]
  );

  return (
    <NotificationContext.Provider
      value={{ notify, success, error, warning, info }}
    >
      {children}
      <Snackbar
        open={notification.open}
        autoHideDuration={notification.duration}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={notification.keepOpen ? handleClose : undefined}
          severity={notification.severity}
          sx={{ width: '100%' }}
          elevation={6}
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
};
