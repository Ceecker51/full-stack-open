import { createSlice } from '@reduxjs/toolkit';
import { setNotification } from './notificationReducer';

import blogService from '../services/blogs';

const sortByLikes = (a, b) => {
  if (a.likes > b.likes) {
    return -1;
  } else if (a.likes < b.likes) {
    return 1;
  }

  return 0;
};

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload.sort(sortByLikes);
    },
    appendBlog(state, action) {
      state.push(action.payload);
    },
    removeBlog(state, action) {
      const id = action.payload;
      return state.filter((blog) => blog.id !== id);
    },
  },
});

export const { setBlogs, appendBlog, removeBlog } = blogSlice.actions;

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll();
    dispatch(setBlogs(blogs));
  };
};

export const createBlog = (blog) => {
  return async (dispatch) => {
    try {
      const newBlog = await blogService.create(blog);
      dispatch(appendBlog(newBlog));
      dispatch(setNotification('success', `create blog ${blog.title}`, 5));
    } catch (error) {
      dispatch(setNotification('error', error.response.data.error, 5));
    }
  };
};

export const deleteBlog = (blog) => {
  return async (dispatch) => {
    try {
      await blogService.remove(blog.id);
      dispatch(removeBlog(blog.id));
      dispatch(setNotification('success', `delete blog ${blog.title}`, 5));
    } catch (error) {
      dispatch(setNotification('error', error.response.data.error, 5));
    }
  };
};

export default blogSlice.reducer;
