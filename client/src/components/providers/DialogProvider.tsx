import React, { createContext, useState, useCallback, ReactNode } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';

interface DialogOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  color?: 'error' | 'primary' | 'warning';
}

interface DialogContextType {
  confirm: (options: DialogOptions) => Promise<boolean>;
  confirmDelete: (entityName: string) => Promise<boolean>;
}

export const DialogContext = createContext<DialogContextType | undefined>(
  undefined
);

export const DialogProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<DialogOptions>({
    title: '',
    message: '',
    confirmLabel: 'Confirmer',
    cancelLabel: 'Annuler',
    color: 'primary',
  });
  const [resolveRef, setResolveRef] = useState<(value: boolean) => void>();

  const confirm = useCallback((options: DialogOptions): Promise<boolean> => {
    setOptions(options);
    setOpen(true);
    return new Promise((resolve) => {
      setResolveRef(() => resolve);
    });
  }, []);

  const confirmDelete = useCallback(
    (entityName: string): Promise<boolean> => {
      return confirm({
        title: 'Confirmation de suppression',
        message: `Êtes-vous sûr de vouloir supprimer ${entityName} ? Cette action est irréversible.`,
        confirmLabel: 'Supprimer',
        cancelLabel: 'Annuler',
        color: 'error',
      });
    },
    [confirm]
  );

  const handleClose = () => {
    setOpen(false);
    resolveRef?.(false);
  };

  const handleConfirm = () => {
    setOpen(false);
    resolveRef?.(true);
  };

  return (
    <DialogContext.Provider value={{ confirm, confirmDelete }}>
      {children}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{options.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{options.message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            {options.cancelLabel}
          </Button>
          <Button
            onClick={handleConfirm}
            color={options.color}
            variant="contained"
            autoFocus
          >
            {options.confirmLabel}
          </Button>
        </DialogActions>
      </Dialog>
    </DialogContext.Provider>
  );
};
