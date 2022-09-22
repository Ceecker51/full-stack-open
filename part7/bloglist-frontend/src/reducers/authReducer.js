import { createSlice } from '@reduxjs/toolkit';

import loginService from '../services/login';
import blogService from '../services/blogs';
import { setNotification } from './notificationReducer';

const authSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    setUser(state, action) {
      return action.payload;
    },
    loginUser(state, action) {
      return action.payload;
    },
    logoutUser(state, action) {
      return null;
    },
  },
});

export const { setUser, loginUser, logoutUser } = authSlice.actions;

export const initializeUser = () => {
  return (dispatch) => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser');
    if (!loggedUserJSON) {
      return;
    }

    const user = JSON.parse(loggedUserJSON);
    blogService.setToken(user.token);
    dispatch(setUser(user));
  };
};

export const login = (username, password) => {
  return async (dispatch) => {
    try {
      const user = await loginService.login({ username, password });

      window.localStorage.setItem('loggedBloglistUser', JSON.stringify(user));
      blogService.setToken(user.token);

      dispatch(setUser(user));
    } catch (error) {
      dispatch(setNotification('error', error.response.data.error));
    }
  };
};

export const logout = () => {
  return (dispatch) => {
    window.localStorage.removeItem('loggedBloglistUser');
    blogService.setToken(null);
    dispatch(logoutUser());
  };
};

export default authSlice.reducer;
