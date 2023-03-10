import React, { useEffect, useState } from 'react';
import { Stack, Alert, Snackbar, Slide } from '@mui/material';

function TransitionUp(props) {
  return <Slide {...props} direction='up' />;
}

export default function ErrorSnackBar({ message, clearMessage }) {
  const [open, setOpen] = useState(Boolean(message));

  useEffect(() => {
    setOpen(Boolean(message));
  }, [message]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    clearMessage();
    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      TransitionComponent={TransitionUp}
    >
      <Stack direction='row' spacing={2}>
        <Alert onClose={handleClose} severity='error' sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Stack>
    </Snackbar>
  );
}
