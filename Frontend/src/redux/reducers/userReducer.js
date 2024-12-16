import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: !!localStorage.getItem('accessToken'),
  token: localStorage.getItem('accessToken'),
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
};

const userReducer = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginAsync: (state, action) => {
      state.isAuthenticated = true;
      state.token = action.payload.tokens.accessToken;
      state.user = action.payload.data;
      localStorage.setItem('accessToken', action.payload.tokens.accessToken);
      localStorage.setItem('refreshToken', action.payload.tokens.refreshToken);
      localStorage.setItem('user', JSON.stringify(action.payload.data));
    },

    logoutAsync: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      localStorage.clear();
    },

    UpdateUserData: (state, action) => {
      localStorage.setItem('user', JSON.stringify(action.payload));
      state.user = action.payload;
    },

    signupAsync: (state, action) => {
      state.isAuthenticated = true;
      state.token = action.payload.tokens.accessToken;
      state.user = action.payload.data;
      localStorage.setItem('accessToken', action.payload.tokens.accessToken);
      localStorage.setItem('refreshToken', action.payload.tokens.refreshToken);
      localStorage.setItem('user', JSON.stringify(action.payload.data));
    },
  },
});

export const { loginAsync, logoutAsync, UpdateUserData, signupAsync } = userReducer.actions;
export default userReducer.reducer;
