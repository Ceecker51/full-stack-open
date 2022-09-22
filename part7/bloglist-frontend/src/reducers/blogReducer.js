import { createSlice } from '@reduxjs/toolkit';

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
    appendBlogs(state, action) {
      state.push(action.payload);
    },
  },
});

export const { setBlogs, appendBlogs } = blogSlice.actions;

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll();
    dispatch(setBlogs(blogs));
  };
};

export const createBlog = (blogObject) => {
  return async (dispatch) => {
    const newBlog = await blogService.create(blogObject);
    dispatch(appendBlogs(newBlog));
  };
};

export default blogSlice.reducer;
