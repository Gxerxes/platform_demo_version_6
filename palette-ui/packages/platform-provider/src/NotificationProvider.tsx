import { Alert, Snackbar } from '@mui/material';
import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

export type NotificationSeverity = 'success' | 'error' | 'warning' | 'info';

export interface NotificationOptions {
  message: string;
  severity?: NotificationSeverity;
  duration?: number;
}

interface NotificationState extends NotificationOptions {
  id: number;
  open: boolean;
}

export interface NotificationContextValue {
  showNotification: (options: NotificationOptions) => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showWarning: (message: string) => void;
  showInfo: (message: string) => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

export interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notification, setNotification] = useState<NotificationState | null>(null);

  const showNotification = useCallback((options: NotificationOptions) => {
    setNotification({
      id: Date.now(),
      open: true,
      severity: options.severity ?? 'info',
      duration: options.duration ?? 4000,
      message: options.message,
    });
  }, []);

  const showSuccess = useCallback(
    (message: string) => showNotification({ message, severity: 'success' }),
    [showNotification],
  );

  const showError = useCallback(
    (message: string) => showNotification({ message, severity: 'error', duration: 6000 }),
    [showNotification],
  );

  const showWarning = useCallback(
    (message: string) => showNotification({ message, severity: 'warning' }),
    [showNotification],
  );

  const showInfo = useCallback(
    (message: string) => showNotification({ message, severity: 'info' }),
    [showNotification],
  );

  const handleClose = useCallback(() => {
    setNotification((prev) => (prev ? { ...prev, open: false } : null));
  }, []);

  return (
    <NotificationContext.Provider
      value={{ showNotification, showSuccess, showError, showWarning, showInfo }}
    >
      {children}
      <Snackbar
        key={notification?.id}
        open={notification?.open ?? false}
        autoHideDuration={notification?.duration}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleClose}
          severity={notification?.severity ?? 'info'}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification?.message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
}

export function useNotification(): NotificationContextValue {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
}
