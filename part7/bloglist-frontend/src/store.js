import { configureStore } from '@reduxjs/toolkit';

import notificationReducer from './reducers/notificationReducer';
import blogReducer from './reducers/blogReducer';
import authReducer from './reducers/authReducer';
import userReducer from './reducers/userReducer';

const store = configureStore({
  reducer: {
    blogs: blogReducer,
    users: userReducer,
    user: authReducer,
    notification: notificationReducer,
  },
});

export default store;
