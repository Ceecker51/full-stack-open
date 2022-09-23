import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route, useMatch } from 'react-router-dom';

import LoginForm from './components/LoginForm';
import BlogForm from './components/BlogForm';
import Notification from './components/Notification';
import Togglable from './components/Togglable';
import UserList from './components/UserList';
import User from './components/User';
import BlogDetails from './components/BlogDetails';
import NavMenu from './components/NavMenu';
import BlogList from './components/BlogList';

import { initializeBlogs, createBlog } from './reducers/blogReducer';
import { initializeUser } from './reducers/authReducer';
import { initializeUsers } from './reducers/userReducer';

const App = () => {
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blogs);
  const authUser = useSelector((state) => state.authUser);
  const users = useSelector((state) => state.users);

  const blogFormRef = useRef();

  // ########################
  // Effect hooks
  // ########################

  useEffect(() => {
    dispatch(initializeUser());
    dispatch(initializeBlogs());
    dispatch(initializeUsers());
  }, [dispatch]);

  const userById = (id) => users.find((user) => user.id === id);
  const blogById = (id) => blogs.find((blog) => blog.id === id);

  // ########################
  // Routes
  // ########################

  const userMatch = useMatch('/users/:id');
  const user = userMatch ? userById(userMatch.params.id) : null;

  const blogMatch = useMatch('/blogs/:id');
  const blog = blogMatch ? blogById(blogMatch.params.id) : null;

  // ########################
  // Actions
  // ########################

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility();
    dispatch(createBlog(blogObject));
  };

  if (authUser === null) {
    return (
      <div style={{ marginTop: 20 }} className="container">
        <h2>log in to application</h2>
        <Notification />
        <LoginForm />
      </div>
    );
  }

  const resetBlog = () => {
    blogFormRef.current.toggleVisibility();
  };

  return (
    <div className="container">
      <NavMenu />
      <Notification />

      <div style={{ marginTop: 10 }}>
        <h2>blog app</h2>
        <Routes>
          <Route path="/users/:id" element={<User user={user} />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/blogs/:id" element={<BlogDetails blog={blog} />} />
          <Route
            path="/"
            element={
              <div style={{ marginTop: 10 }}>
                <Togglable btnLabel="create new blog" ref={blogFormRef}>
                  <BlogForm createBlog={addBlog} resetBlog={resetBlog} />
                </Togglable>
                <BlogList />
              </div>
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default App;
