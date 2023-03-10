import React, { useState, useEffect } from 'react';

import {
  Box,
  Stack,
  FormControl,
  TextField,
  FormHelperText,
  IconButton,
  Select,
  InputLabel,
  MenuItem,
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';

function ChatWarmupMessageField({ index, value, setValue, remove }) {
  const [role, setRole] = useState(value ? value.role : '');
  const [content, setContent] = useState(value ? value.content : '');

  useEffect(() => {
    setRole(value.role);
    setContent(value.content);
  }, [value]);

  return (
    <Stack
      direction='row'
      alignItems='center'
      spacing={1}
      sx={{ width: '100%', display: 'flex' }}
    >
      <Box sx={{ minWidth: '120px', display: 'flex' }}>
        <FormControl fullWidth required>
          <InputLabel id={`chat-warmup-message-role-${index}-label`}>
            Role
          </InputLabel>
          <Select
            labelId={`chat-warmup-message-role-${index}-label`}
            id={`chat-warmup-message-role-${index}`}
            value={role}
            label='Role'
            aria-describedby={`chat-warmup-message-role-${index}-helper-text`}
            onChange={(event) => {
              const { value: newValue } = event.target;
              setRole(newValue);
              setValue(index, { role: newValue, content, warmup: true });
            }}
          >
            <MenuItem value='system'>System</MenuItem>
            <MenuItem value='user'>User</MenuItem>
            <MenuItem value='assistant'>Assistant</MenuItem>
          </Select>

          <FormHelperText id={`chat-warmup-message-role-${index}-helper-text`}>
            Select the Role
          </FormHelperText>
        </FormControl>
      </Box>
      <Box sx={{ width: '100%', display: 'flex' }}>
        <FormControl fullWidth required>
          <TextField
            label='Content'
            id={`chat-warmup-message-content-${index}`}
            aria-describedby={`chat-warmup-message-content-${index}-helper-text`}
            variant='outlined'
            onChange={(event) => {
              const { value: newValue } = event.target;
              setContent(newValue);
              setValue(index, { role, content: newValue, warmup: true });
            }}
            value={content}
          />

          <FormHelperText
            id={`chat-warmup-message-content-${index}-helper-text`}
          >
            Enter the message
          </FormHelperText>
        </FormControl>
      </Box>
      <IconButton
        onClick={() => {
          remove(index);
        }}
      >
        <DeleteIcon />
      </IconButton>
    </Stack>
  );
}

export default ChatWarmupMessageField;
