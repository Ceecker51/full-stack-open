import { useState, useEffect, useRef } from 'react';

import Blog from './components/Blog';
import LoginForm from './components/LoginForm';
import BlogForm from './components/BlogForm';
import Notification from './components/Notification';
import Togglable from './components/Togglable';

import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
  // ############################
  // Component State
  // ############################

  const [blogs, setBlogs] = useState([]);

  // login
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  // notifications
  const [notifyMessage, setNotifyMessage] = useState(null);

  // ########################
  // Component References
  // ########################

  let blogFormRef = useRef();

  // ########################
  // Effect hooks
  // ########################

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs.sort(sortByLikes)));
  }, []);

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
    setNotifyMessage({ type, text });
    setTimeout(() => setNotifyMessage(null), 5000);
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
    } catch (error) {
      showMessage('error', error.response.data.error);
    }
  };

  const handleLogout = (event) => {
    event.preventDefault();

    window.localStorage.removeItem('loggedBloglistUser');
    setUser(null);
  };

  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject);
      setBlogs(blogs.concat(returnedBlog).sort(sortByLikes));

      blogFormRef.current.toggleVisibility();

      showMessage(
        'success',
        `A new blog ${blogObject.title} by ${blogObject.author} added`
      );
    } catch (error) {
      showMessage('error', error.response.data.error);
    }
  };

  const handleLike = async (id) => {
    const blog = blogs.find((blog) => blog.id === id);
    const changedBlog = { ...blog, likes: blog.likes + 1 };

    try {
      const returnedBlog = await blogService.update(id, changedBlog);
      setBlogs(
        blogs
          .map((blog) => (blog.id !== id ? blog : returnedBlog))
          .sort(sortByLikes)
      );
      showMessage(
        'success',
        `Blog ${returnedBlog.title} was updated on server`
      );
    } catch (error) {
      setBlogs(blogs.filter((n) => n.id !== id));
      showMessage('error', error.response.data.error);
    }
  };

  // ########################
  // Helper
  // ########################

  const sortByLikes = (a, b) => {
    if (a.likes > b.likes) {
      return -1;
    } else if (a.likes < b.likes) {
      return 1;
    }

    return 0;
  };

  // #############################
  // Appearance
  // #############################

  if (user === null) {
    return (
      <div>
        <h2>log in to application</h2>
        <Notification message={notifyMessage} />
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
      <Notification message={notifyMessage} />
      <div>
        <p>
          {user.name} logged in <button onClick={handleLogout}>logout</button>
        </p>
      </div>
      <Togglable btnLabel="create new blog" ref={blogFormRef}>
        <h2>create new</h2>
        <BlogForm createBlog={addBlog} />
      </Togglable>

      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} addLike={() => handleLike(blog.id)} />
      ))}
    </div>
  );
};

export default App;
