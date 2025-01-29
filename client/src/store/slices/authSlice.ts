import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface User {
  firstName: string;
  lastName: string;
  id: string;
  email: string;
  role: 'admin' | 'collaborator';
  startDate: Date;
  endDate: Date;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }) => {
    const response = await fetch('http://localhost:8000/auth/login', {
      method: 'POST',
      credentials: 'include', // Important pour les cookies
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error('Invalid credentials');
    }

    return await response.json();
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  const response = await fetch('http://localhost:8000/auth/logout', {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Erreur lors de la déconnexion : ${response.statusText}`);
  }
});

export const checkAuth = createAsyncThunk('auth/check', async () => {
  const response = await fetch('http://localhost:8000/auth/me', {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Not authenticated');
  }

  return await response.json();
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isLoading: true,
    error: null,
  } as AuthState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Login failed';
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
      });
  },
});

export default authSlice.reducer;
