import { createTheme } from '@mui/material';

export const theme = createTheme({
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: 'white', // Couleur de fond explicite
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'gray', // Couleur des bordures
            },
            '&:hover fieldset': {
              borderColor: 'black', // Bordure au survol
            },
          },
        },
      },
    },
  },
});
