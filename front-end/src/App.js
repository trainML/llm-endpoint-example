import { useState } from 'react';
import axios from 'axios';
import { Grid, Container } from '@mui/material';

import Header from './Header';
import EndpointConfiguration from './EndpointConfiguration';

import ErrorSnackBar from './ErrorSnackBar';
import PromptWindow from './PromptWindow';

function App() {
  const [api_error, setApiError] = useState('');
  const [prompt, setPrompt] = useState('');
  const [completion, setCompletion] = useState('');
  const [endpoint, setEndpoint] = useState('');
  const [interaction_type, setInteractionType] = useState('chat');
  const [max_tokens, setMaxTokens] = useState(2048);
  const [temperature, setTemperature] = useState(0.7);
  const [top_p, setTopP] = useState(0.2);
  const [stop, setStop] = useState(`["\\n\\n"]`);
  const [chat_warmup, setChatWarmup] = useState([
    {
      role: 'system',
      content:
        'You are a helpful assistant.  All your responses will be prefixed with "assistant".',
      warmup: true,
    },
    {
      role: 'user',
      content: 'How are you today?',
      warmup: true,
    },
    {
      role: 'assistant',
      content: "I'm great, how about you?",
      warmup: true,
    },
    {
      role: 'user',
      content: "I'm also great.",
      warmup: true,
    },
    {
      role: 'assistant',
      content: 'What are you up to today?',
      warmup: true,
    },
    {
      role: 'user',
      content: 'Looking forward to a great conversation with you.',
      warmup: true,
    },
    {
      role: 'assistant',
      content: 'Sounds good.  How can I help?',
      warmup: true,
    },
  ]);
  const [chat_history, setChatHistory] = useState(chat_warmup);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { value: newValue } = event.target;
    setPrompt(newValue);
  };

  const setConfiguration = (values) => {
    setEndpoint(values.endpoint);
    setMaxTokens(values.max_tokens);
    setTemperature(values.temperature);
    setTopP(values.top_p);
    setStop(values.stop);
    setChatWarmup(values.chat_warmup);
    setInteractionType(values.interaction_type);
    setChatHistory(values.chat_warmup);
    setPrompt('');
    setCompletion('');
  };

  const sendPrompt = async () => {
    setLoading(true);
    let payload;
    if (interaction_type === 'chat') {
      const new_chat_history = [
        ...chat_history,
        { role: 'user', content: prompt },
      ];
      setChatHistory(new_chat_history);
      payload = {
        messages: new_chat_history,
        max_tokens,
        temperature,
        top_p,
        stop: JSON.parse(stop),
      };
    } else {
      let new_prompt;
      if (Boolean(completion)) {
        new_prompt = `${prompt} ${completion}`;
        setPrompt(new_prompt);
        setCompletion('');
      } else {
        new_prompt = prompt;
      }
      payload = {
        prompt: new_prompt,
        max_tokens,
        temperature,
        top_p,
        stop: JSON.parse(stop),
      };
    }

    try {
      const result = await axios.post(
        `${endpoint}/${interaction_type}`,
        payload
      );
      if (interaction_type === 'chat') {
        setChatHistory([...payload.messages, result.data]);
        setPrompt('');
      } else {
        setCompletion(result.data);
      }
    } catch (error) {
      console.log(error);
      if (error.response) {
        setApiError(
          `An error occured: ${error.response.status} - ${JSON.stringify(
            error.response.data
          )} `
        );
      } else {
        setApiError(
          'Network Error Occurred.  Either endpoint URL is invalid or generation exceeded 100s.'
        );
      }
    }
    setLoading(false);
  };

  return (
    <Grid>
      <Header />
      <br />
      <Container>
        <Grid container xs={12} spacing={2}>
          <Grid item xs={12}>
            <PromptWindow
              interaction_type={interaction_type}
              chat_history={chat_history}
              prompt={prompt}
              setPrompt={handleChange}
              completion={completion}
              send={sendPrompt}
              reset={() => {
                setChatHistory(chat_warmup);
              }}
              loading={loading}
              disabled={!Boolean(endpoint) || !Boolean(prompt)}
            />
          </Grid>
          <Grid item xs={12}>
            <EndpointConfiguration
              current_values={{
                endpoint,
                interaction_type,
                max_tokens,
                temperature,
                top_p,
                stop,
                chat_warmup,
              }}
              setConfiguration={setConfiguration}
            />
          </Grid>
        </Grid>
        <ErrorSnackBar
          message={api_error}
          clearMessage={() => setApiError('')}
        />
      </Container>
    </Grid>
  );
}

export default App;
