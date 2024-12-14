import { createTheme } from '@mui/material';

export const theme = createTheme({
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          color: 'white', // Texte
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'white', // Contours
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'white', // Contours au survol
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'white', // Contours au focus
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: 'white', // Placeholder
        },
      },
    },
  },
});
