import React from 'react';

import {
  TextField,
  Button,
  Stack,
  Box,
  CircularProgress,
  Alert,
  AlertTitle,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import QuestionMarkOutlinedIcon from '@mui/icons-material/QuestionMarkOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import toTitleCase from './toTitleCase';

function PromptWindow({
  interaction_type,
  chat_history,
  prompt,
  setPrompt,
  completion,
  loading,
  disabled,
  send,
  reset,
}) {
  return (
    <Stack spacing={2} direction='column'>
      {interaction_type === 'chat' ? (
        <>
          {chat_history
            ? chat_history
                .filter((record) => !record.warmup)
                .map((record) => {
                  return (
                    <Alert
                      severity={record.role === 'user' ? 'info' : 'success'}
                      icon={
                        record.role === 'user' ? (
                          <QuestionMarkOutlinedIcon fontSize='inherit' />
                        ) : (
                          <CheckCircleOutlineIcon fontSize='inherit' />
                        )
                      }
                    >
                      <AlertTitle>{toTitleCase(record.role)}</AlertTitle>
                      {record.content}
                    </Alert>
                  );
                })
            : undefined}
          {loading ? (
            <Box style={{ display: 'flex', justifyContent: 'center' }}>
              <CircularProgress />
            </Box>
          ) : undefined}
        </>
      ) : undefined}
      <TextField
        sx={{ width: '100%' }}
        id='prompt'
        label='Prompt'
        multiline
        rows={10}
        value={completion ? `${prompt} ${completion}` : prompt}
        onChange={setPrompt}
      />

      <Stack
        spacing={2}
        direction='row'
        justifyContent='center'
        alignItems='center'
      >
        <LoadingButton
          variant='contained'
          color='brand'
          onClick={send}
          loading={loading}
          disabled={disabled}
        >
          Send
        </LoadingButton>
        {interaction_type === 'chat' ? (
          <Button variant='outlined' onClick={reset} disabled={loading}>
            Reset Chat
          </Button>
        ) : undefined}
      </Stack>
    </Stack>
  );
}

export default PromptWindow;
