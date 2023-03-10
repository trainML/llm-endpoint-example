import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

export default createTheme({
  palette: {
    primary: {
      main: '#212121',
      light: '#484848',
      dark: '#000000',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#a219a5',
      light: '#d655d7',
      dark: '#6f0075',
      contrastText: '#ffffff',
    },
    brand: {
      main: '#c924d2',
      light: '#c924d2',
      dark: '#c924d2',
      contrastText: '#ffffff',
    },
    brandBlack: {
      main: '#130201',
      contrastText: '#fff',
    },
    error: {
      main: red.A400,
    },
  },
  typography: {
    fontFamily: "'Rubik', sans-serif",
    h5: {
      fontWeight: 500,
    },
  },
});
