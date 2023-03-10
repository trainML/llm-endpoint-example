import React, { useState } from 'react';

import {
  Button,
  Box,
  Typography,
  Grid,
  Toolbar,
  Stack,
  FormControl,
  TextField,
  FormHelperText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  AccordionActions,
  Select,
  InputLabel,
  MenuItem,
} from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChatWarmupField from './ChatWarmupField';

function EndpointConfiguration({ current_values, setConfiguration }) {
  const [expanded, setExpanded] = useState(true);
  const [pristine, setPristine] = useState(true);
  const [endpoint, setEndpoint] = useState(
    current_values ? current_values.endpoint : ''
  );
  const [interaction_type, setInteractionType] = useState(
    current_values ? current_values.interaction_type : ''
  );
  const [max_tokens, setMaxTokens] = useState(
    current_values ? current_values.max_tokens : 500
  );
  const [temperature, setTemperature] = useState(
    current_values ? current_values.temperature : 1.0
  );
  const [top_p, setTopP] = useState(
    current_values ? current_values.top_p : 1.0
  );
  const [stop, setStop] = useState(current_values ? current_values.stop : '[]');
  const [chat_warmup, setChatWarmup] = useState(
    current_values ? current_values.chat_warmup : []
  );
  const handleSubmit = () => {
    setConfiguration({
      endpoint,
      interaction_type,
      max_tokens,
      temperature,
      top_p,
      stop,
      chat_warmup,
    });
    setExpanded(false);
  };
  return (
    <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls='panel1a-content'
        id='panel1a-header'
      >
        <Typography variant='h6'>Configuration</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12} lg={12}>
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={12} md={12} lg={12}>
                  <Typography variant='subtitle'>Endpoint</Typography>
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                  <Box>
                    <FormControl fullWidth required>
                      <TextField
                        label='Endpoint Address'
                        id='endpoint'
                        aria-describedby='endpoint-helper-text'
                        variant='outlined'
                        onChange={(event) => {
                          setPristine(false);
                          setEndpoint(event.target.value);
                        }}
                        value={endpoint}
                      />

                      <FormHelperText id='endpoint-helper-text'>
                        Enter the LLM endpoint URL
                      </FormHelperText>
                    </FormControl>
                  </Box>
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                  {' '}
                  <Box>
                    <FormControl fullWidth required>
                      <InputLabel id='type-label'>Type</InputLabel>
                      <Select
                        labelId='type-label'
                        id='interaction_type'
                        value={interaction_type}
                        label='Type'
                        aria-describedby='type-helper-text'
                        onChange={(event) => {
                          setPristine(false);
                          setInteractionType(event.target.value);
                        }}
                      >
                        <MenuItem value='completion'>Completion</MenuItem>
                        <MenuItem value='chat'>Chat</MenuItem>
                      </Select>

                      <FormHelperText id='type-helper-text'>
                        Select the type of interaction
                      </FormHelperText>
                    </FormControl>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          <Grid item xs={12} md={12} lg={12}>
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={12} md={12} lg={12}>
                  <Typography variant='subtitle'>
                    Generation Settings
                  </Typography>
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                  <Box>
                    <FormControl fullWidth>
                      <TextField
                        label='Max Tokens'
                        id='max_tokens'
                        type='number'
                        aria-describedby='max-tokens-helper-text'
                        variant='outlined'
                        onChange={(event) => {
                          setPristine(false);
                          setMaxTokens(event.target.value);
                        }}
                        value={max_tokens}
                      />

                      <FormHelperText id='max-tokens-helper-text'>
                        Enter the maximum tokens to generate (includes input
                        tokens)
                      </FormHelperText>
                    </FormControl>
                  </Box>
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                  <Box>
                    <FormControl fullWidth>
                      <TextField
                        label='Temperature'
                        id='temperature'
                        type='number'
                        aria-describedby='temperature-helper-text'
                        variant='outlined'
                        onChange={(event) => {
                          setPristine(false);
                          setTemperature(event.target.value);
                        }}
                        value={temperature}
                      />

                      <FormHelperText id='temperature-helper-text'>
                        Enter the sampling temperature to use, between 0 and 2.
                      </FormHelperText>
                    </FormControl>
                  </Box>
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                  <Box>
                    <FormControl fullWidth>
                      <TextField
                        label='Top P'
                        id='top_p'
                        type='number'
                        aria-describedby='top-p-helper-text'
                        variant='outlined'
                        onChange={(event) => {
                          setPristine(false);
                          setTopP(event.target.value);
                        }}
                        value={top_p}
                      />

                      <FormHelperText id='top-p-helper-text'>
                        Enter the top_p probability for nucleus sampling,
                        between 0 and 1.
                      </FormHelperText>
                    </FormControl>
                  </Box>
                </Grid>

                <Grid item xs={12} md={12} lg={12}>
                  <Box>
                    <FormControl fullWidth>
                      <TextField
                        sx={{ width: '100%' }}
                        id='stop'
                        label='Stop Words'
                        value={stop}
                        aria-describedby='stop-helper-text'
                        onChange={(event) => {
                          setPristine(false);
                          setStop(event.target.value);
                        }}
                      />
                      <FormHelperText id='stop-helper-text'>
                        Enter the words to stop generation early as a JSON
                        array, maximum 4.
                      </FormHelperText>
                    </FormControl>
                  </Box>
                </Grid>
                {interaction_type === 'chat' ? (
                  <Grid item xs={12} md={12} lg={12}>
                    <ChatWarmupField
                      initialValues={chat_warmup}
                      setValue={setChatWarmup}
                    />
                  </Grid>
                ) : undefined}
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </AccordionDetails>
      <AccordionActions>
        <Toolbar>
          <Stack spacing={2} direction='row'>
            <Button
              variant='contained'
              color='brand'
              onClick={handleSubmit}
              disabled={pristine || endpoint === ''}
            >
              Update
            </Button>

            <Button
              variant='outlined'
              onClick={() => {
                setEndpoint(current_values ? current_values.endpoint : '');
                setInteractionType(
                  current_values ? current_values.interaction_type : ''
                );
                setMaxTokens(current_values ? current_values.max_tokens : 500);
                setTemperature(
                  current_values ? current_values.temperature : 1.0
                );
                setTopP(current_values ? current_values.top_p : 1.0);
                setStop(current_values ? current_values.stop : '[]');
                setChatWarmup(current_values ? current_values.chat_warmup : []);
              }}
            >
              Cancel
            </Button>
          </Stack>
        </Toolbar>
      </AccordionActions>
    </Accordion>
  );
}

export default EndpointConfiguration;
