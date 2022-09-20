import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    updateNotification(state, action) {
      return action.payload;
    },
    removeNotification(state, action) {
      return '';
    },
  },
});

export const { updateNotification, removeNotification } =
  notificationSlice.actions;

export const setNotification = (text, seconds) => {
  return (dispatch) => {
    dispatch(updateNotification(text));
    setTimeout(() => dispatch(removeNotification()), seconds * 1000);
  };
};

export default notificationSlice.reducer;
