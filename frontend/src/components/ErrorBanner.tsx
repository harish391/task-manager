import React from 'react';
import { Alert, Collapse } from '@mui/material';

interface ErrorBannerProps {
  message: string | null;
  onDismiss: () => void;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({ message, onDismiss }) => {
  return (
    <Collapse in={!!message}>
      {message && (
        <Alert
          severity="error"
          onClose={onDismiss}
          sx={{ mb: 2 }}
        >
          {message}
        </Alert>
      )}
    </Collapse>
  );
};
