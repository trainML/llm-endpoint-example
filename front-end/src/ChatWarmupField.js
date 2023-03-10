import React, { useState, useCallback } from 'react';

import { Button, Box, Typography, Stack } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import ChatWarmupMessageField from './ChatWarmupMessageField';

function ChatWarmupField({ initialValues, setValue }) {
  const [messages, setMessages] = useState(initialValues || []);

  const addMessage = useCallback(() => {
    const new_messages = [...messages, { role: '', content: '', warmup: true }];
    setMessages(new_messages);
    setValue(new_messages);
  }, [messages, setMessages, setValue]);

  const removeMessage = useCallback(
    (i) => {
      const new_messages = [...messages];
      new_messages.splice(i, 1);

      setMessages(new_messages);
      setValue(new_messages);
    },
    [messages, setMessages, setValue]
  );

  const setMessageValue = useCallback(
    (i, values) => {
      const new_messages = [...messages];
      new_messages[i] = values;
      setMessages(new_messages);
      setValue(new_messages);
    },
    [messages, setMessages, setValue]
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Stack spacing={2} direction='column' alignItems='center'>
        {messages.map((value, index) => {
          return (
            <ChatWarmupMessageField
              key={`message-${index}`}
              index={index}
              value={value}
              setValue={setMessageValue}
              remove={removeMessage}
            />
          );
        })}
        <Button variant='outlined' color='brand' onClick={() => addMessage()}>
          <Stack direction='row' spacing={1} alignItems='center'>
            <AddCircleOutlineIcon />
            <Typography variant='button' display='block' gutterBottom>
              Add Message
            </Typography>
          </Stack>
        </Button>
      </Stack>
    </Box>
  );
}

export default ChatWarmupField;
