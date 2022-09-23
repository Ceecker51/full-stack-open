import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route } from 'react-router-dom';

import Blog from './components/Blog';
import LoginForm from './components/LoginForm';
import BlogForm from './components/BlogForm';
import Notification from './components/Notification';
import Togglable from './components/Togglable';
import UserList from './components/UserList';

import { initializeBlogs, createBlog, deleteBlog, likeBlog } from './reducers/blogReducer';
import { initializeUser, logout } from './reducers/authReducer';
import { initializeUsers } from './reducers/userReducer';

const App = () => {
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blogs);
  const user = useSelector((state) => state.user);

  const blogFormRef = useRef();

  // ########################
  // Effect hooks
  // ########################

  useEffect(() => {
    dispatch(initializeUser());
    dispatch(initializeBlogs());
    dispatch(initializeUsers());
  }, [dispatch]);

  // ########################
  // Actions
  // ########################

  const handleLogout = () => {
    dispatch(logout());
  };

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility();
    dispatch(createBlog(blogObject));
  };

  const handleLike = (id) => {
    const blog = blogs.find((blog) => blog.id === id);
    dispatch(likeBlog(blog));
  };

  const removeBlog = (id) => {
    const blog = blogs.find((blog) => blog.id === id);

    const result = window.confirm(`Remove blog ${blog.title} by ${blog.author}`);
    if (!result) {
      return;
    }

    dispatch(deleteBlog(blog));
  };

  if (user === null) {
    return (
      <div>
        <h2>log in to application</h2>
        <Notification />
        <LoginForm />
      </div>
    );
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      <div>
        <p>{user.name} logged in</p>
        <button onClick={handleLogout}>logout</button>
      </div>
      <Routes>
        <Route
          path="/users"
          element={
            <div>
              <h2>Users</h2>
              <UserList />
            </div>
          }
        />
        <Route
          path="/"
          element={
            <div>
              <Togglable btnLabel="create new blog" ref={blogFormRef}>
                <BlogForm createBlog={addBlog} />
              </Togglable>

              {blogs.map((blog) => (
                <Blog
                  key={blog.id}
                  user={user}
                  blog={blog}
                  addLike={() => handleLike(blog.id)}
                  removeBlog={() => removeBlog(blog.id)}
                />
              ))}
            </div>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
