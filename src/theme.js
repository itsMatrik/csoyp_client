import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#E3311D',
    },
    secondary: {
      main: '#7C8685',
    },
    background: {
      default: '#050507',
      paper: '#0A0A0F',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#AAACA1',
    },
  },
  typography: {
    fontFamily: '"Roboto", sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
});

export default theme;