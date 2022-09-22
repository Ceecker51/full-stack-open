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

  const blogs = useSelector((state) => state.blogs);
  const [user, setUser] = useState(null);

  const blogFormRef = useRef();

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
    dispatch(setNotification(type, text, 5));
  };

  const handleLogin = async (userObject) => {
    try {
      const user = await loginService.login(userObject);

      window.localStorage.setItem('loggedBloglistUser', JSON.stringify(user));
      blogService.setToken(user.token);

      setUser(user);

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
    dispatch(createBlog(blogObject));
    blogFormRef.current.toggleVisibility();
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

  if (user === null) {
    return (
      <div>
        <h2>log in to application</h2>
        <Notification />
        <LoginForm handleLogin={handleLogin} />
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
