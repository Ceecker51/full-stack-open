import { configureStore } from '@reduxjs/toolkit';

import notificationReducer from './reducers/notificationReducer';
import blogReducer from './reducers/blogReducer';
import authReducer from './reducers/authReducer';

const store = configureStore({
  reducer: {
    blogs: blogReducer,
    user: authReducer,
    notification: notificationReducer,
  },
});

export default store;
