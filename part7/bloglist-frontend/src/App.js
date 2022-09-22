import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Blog from './components/Blog';
import LoginForm from './components/LoginForm';
import BlogForm from './components/BlogForm';
import Notification from './components/Notification';
import Togglable from './components/Togglable';

import blogService from './services/blogs';
import loginService from './services/login';

import { setNotification } from './reducers/notificationReducer';
import { initializeBlogs, setBlogs, createBlog } from './reducers/blogReducer';

const App = () => {
  const dispatch = useDispatch();

  // ############################
  // Component State
  // ############################

  const blogFormRef = useRef();
  const blogs = useSelector((state) => state.blogs);

  // login
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  // ########################
  // Effect hooks
  // ########################

  useEffect(() => {
    dispatch(initializeBlogs());
  }, [dispatch]);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser');

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);

      blogService.setToken(user.token);
    }
  }, []);

  // ########################
  // Actions
  // ########################

  const showMessage = (type, text) => {
    dispatch(setNotification({ type, text }, 5));
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem('loggedBloglistUser', JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);

      setUsername('');
      setPassword('');

      showMessage('success', `Welcome ${user.name}!`);
    } catch (error) {
      showMessage('error', error.response.data.error);
    }
  };

  const handleLogout = (event) => {
    event.preventDefault();

    window.localStorage.removeItem('loggedBloglistUser');
    setUser(null);
  };

  const handleLike = async (id) => {
    const blog = blogs.find((blog) => blog.id === id);
    const changedBlog = { ...blog, likes: blog.likes + 1 };

    try {
      const returnedBlog = await blogService.update(id, changedBlog);
      dispatch(setBlogs(blogs.map((blog) => (blog.id !== id ? blog : returnedBlog))));
      showMessage('success', `Blog ${returnedBlog.title} was updated on server`);
    } catch (error) {
      setBlogs(blogs.filter((n) => n.id !== id));
      showMessage('error', error.response.data.error);
    }
  };

  const addBlog = (blogObject) => {
    try {
      dispatch(createBlog(blogObject));

      blogFormRef.current.toggleVisibility();

      showMessage('success', `A new blog ${blogObject.title} by ${blogObject.author} added`);
    } catch (error) {
      showMessage('error', error.response.data.error);
    }
  };

  const removeBlog = async (id) => {
    const blog = blogs.find((blog) => blog.id === id);

    const result = window.confirm(`Remove blog ${blog.title} by ${blog.author}`);

    if (result) {
      try {
        await blogService.remove(id);
        setBlogs(blogs.filter((blog) => blog.id !== id));
        showMessage('success', `blog ${blog.title} by ${blog.author} was deleted!`);
      } catch (error) {
        showMessage('error', error.response.data.error);
      }
    }
  };

  // ########################
  // Helper
  // ########################

  // #############################
  // Appearance
  // #############################

  if (user === null) {
    return (
      <div>
        <h2>log in to application</h2>
        <Notification />
        <LoginForm
          username={username}
          password={password}
          setUsername={setUsername}
          setPassword={setPassword}
          handleLogin={handleLogin}
        />
      </div>
    );
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      <div>
        <p>
          {user.name} logged in <button onClick={handleLogout}>logout</button>
        </p>
      </div>
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
  );
};

export default App;
