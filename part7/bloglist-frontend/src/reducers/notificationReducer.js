import { createSlice } from '@reduxjs/toolkit';

let timeoutID = null;

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    setNotifyMessage(state, action) {
      return action.payload;
    },
    deleteNotifyMessage(state, action) {
      return null;
    },
  },
});

export const setNotification = (message, seconds) => {
  return (dispatch) => {
    const { setNotifyMessage, deleteNotifyMessage } = notificationSlice.actions;

    dispatch(setNotifyMessage(message));

    if (timeoutID) {
      clearTimeout(timeoutID);
    }

    timeoutID = setTimeout(() => {
      dispatch(deleteNotifyMessage());
      timeoutID = null;
    }, seconds * 1000);
  };
};

export default notificationSlice.reducer;
