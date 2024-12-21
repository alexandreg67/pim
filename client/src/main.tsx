import React from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@mui/material';
import { RouterProvider } from 'react-router-dom';
import { theme } from './theme';
import router from './routes';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { DialogProvider } from './components/providers/DialogProvider';
import { NotificationProvider } from './components/providers/NotificationProvider';

const client = new ApolloClient({
  uri: 'http://localhost:8000/api',
  cache: new InMemoryCache(),
});

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <DialogProvider>
          <NotificationProvider>
            <RouterProvider router={router} />
          </NotificationProvider>
        </DialogProvider>
      </ThemeProvider>
    </ApolloProvider>
  </React.StrictMode>
);
