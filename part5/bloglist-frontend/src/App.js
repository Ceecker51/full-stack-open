import { useState, useEffect } from 'react';

import Blog from './components/Blog';
import LoginForm from './components/LoginForm';
import BlogForm from './components/BlogForm';
import Notification from './components/Notification';

import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
  const [blogs, setBlogs] = useState([]);

  // login
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  // blog form
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  // notifications
  const [notifyMessage, setNotifyMessage] = useState(null);

  // ########################
  // Effect hooks
  // ########################

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
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

  const addBlog = async (event) => {
    event.preventDefault();

    const blogObject = {
      title,
      author,
      url,
    };

    try {
      const returnedBlog = await blogService.create(blogObject);
      setBlogs(blogs.concat(returnedBlog));

      setTitle('');
      setAuthor('');
      setUrl('');

      showMessage(
        'success',
        `A new blog ${blogObject.title} by ${blogObject.author} added`
      );
    } catch (error) {
      showMessage('error', error.response.data.error);
    }
  };

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
      <h2>create new</h2>
      <BlogForm
        title={title}
        author={author}
        url={url}
        setAuthor={setAuthor}
        setTitle={setTitle}
        setUrl={setUrl}
        addBlog={addBlog}
      />
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default App;
