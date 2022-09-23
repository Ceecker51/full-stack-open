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
      const id = action.payload.id;
      return state.filter((blog) => blog.id !== id).sort(sortByLikes);
    },
    updateBlog(state, action) {
      const id = action.payload.id;
      return state.map((blog) => (blog.id !== id ? blog : action.payload)).sort(sortByLikes);
    },
  },
});

export const { setBlogs, appendBlog, removeBlog, updateBlog } = blogSlice.actions;

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
      dispatch(setNotification('success', `created blog ${blog.title}`, 5));
    } catch (error) {
      dispatch(setNotification('error', error.response.data.error, 5));
    }
  };
};

export const deleteBlog = (blog) => {
  return async (dispatch) => {
    try {
      await blogService.remove(blog.id);
      dispatch(removeBlog(blog));
      dispatch(setNotification('success', `deleted blog ${blog.title}`, 5));
    } catch (error) {
      dispatch(setNotification('error', error.response.data.error, 5));
    }
  };
};

export const likeBlog = (blog) => {
  return async (dispatch) => {
    try {
      const changedBlog = { ...blog, likes: blog.likes + 1 };
      const updatedBlog = await blogService.update(changedBlog);

      dispatch(updateBlog(updatedBlog));
      dispatch(setNotification('success', `updated blog ${updatedBlog.title}`, 5));
    } catch (error) {
      dispatch(setNotification('error', error.response.data.error, 5));
    }
  };
};

export const commentBlog = (blog, comment) => {
  return async (dispatch) => {
    try {
      const updatedBlog = await blogService.createComment(blog.id, comment);
      dispatch(updateBlog(updatedBlog));
    } catch (error) {
      dispatch(setNotification('error', error.response.data.error, 5));
    }
  };
};

export default blogSlice.reducer;
