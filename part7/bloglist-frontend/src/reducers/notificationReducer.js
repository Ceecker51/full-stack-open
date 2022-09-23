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

export const setNotification = (type, text, seconds = 5) => {
  return (dispatch) => {
    const { setNotifyMessage, deleteNotifyMessage } = notificationSlice.actions;

    dispatch(setNotifyMessage({ type, text }));

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
