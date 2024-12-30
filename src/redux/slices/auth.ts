import { createSlice } from '@reduxjs/toolkit';

type AuthState = {
  isAuthenticated: boolean;
  loading: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  loading: true
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state) => {
      state.isAuthenticated = true
    },
    logout: (state) => {
      state.isAuthenticated = false 
    },
    finishLoading: (state) => {
      state.loading = false
    }
  }
});

export const {
  setAuth,
  logout,
  finishLoading,
} = authSlice.actions

export default authSlice.reducer;