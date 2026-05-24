import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../api/axios';

export const hydrateAuth = createAsyncThunk('auth/hydrate', async (_, { rejectWithValue }) => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const res = await API.get('/auth/me');
    return { user: res.data.user, token };
  } catch {
    localStorage.removeItem('token');
    return rejectWithValue(null);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token') || null,
    loading: !!localStorage.getItem('token')
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('token', action.payload.token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(hydrateAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(hydrateAuth.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.user = action.payload.user;
          state.token = action.payload.token;
        }
      })
      .addCase(hydrateAuth.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
      });
  }
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
