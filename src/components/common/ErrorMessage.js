import React from 'react';
import { Alert, Box, IconButton, Collapse } from '@mui/material';
import { Close } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const ErrorMessage = () => {
  const { error, clearError } = useAuth();

  if (!error) return null;

  return (
    <Box sx={{ position: 'fixed', top: 80, left: 0, right: 0, zIndex: 9999, px: 2 }}>
      <Collapse in={!!error}>
        <Alert
          severity="error"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={clearError}
            >
              <Close fontSize="inherit" />
            </IconButton>
          }
          sx={{
            mb: 2,
            maxWidth: 400,
            margin: '0 auto',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
          }}
        >
          {error}
        </Alert>
      </Collapse>
    </Box>
  );
};

export default ErrorMessage;