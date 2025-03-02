import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@mui/material';
import { RouterProvider } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { fr } from 'date-fns/locale';
import { theme } from './theme';
import router from './routes';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { DialogProvider } from './components/providers/DialogProvider';
import { NotificationProvider } from './components/providers/NotificationProvider';
import { Provider } from 'react-redux';
import { store } from './store';
import { checkAuth } from './store/slices/authSlice';
import { useAppDispatch } from './store/hooks';

const client = new ApolloClient({
  uri: import.meta.env.VITE_API_URL || '/api',
  cache: new InMemoryCache(),
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
});

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return <RouterProvider router={router} />;
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ApolloProvider client={client}>
        <ThemeProvider theme={theme}>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
            <DialogProvider>
              <NotificationProvider>
                <App />
              </NotificationProvider>
            </DialogProvider>
          </LocalizationProvider>
        </ThemeProvider>
      </ApolloProvider>
    </Provider>
  </React.StrictMode>
);
