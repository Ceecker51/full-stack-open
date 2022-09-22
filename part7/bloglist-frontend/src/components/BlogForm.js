import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { createBlog } from '../reducers/blogReducer';
import { setNotification } from '../reducers/notificationReducer';

const BlogForm = ({ toggleVisibility }) => {
  const dispatch = useDispatch();

  // ###############################
  // State
  // ###############################

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  // ###############################
  // Actions
  // ###############################

  const showMessage = (type, text) => {
    dispatch(setNotification({ type, text }, 5));
  };

  const addBlog = (event) => {
    event.preventDefault();

    try {
      const blogObject = { title, author, url };
      dispatch(createBlog(blogObject));

      toggleVisibility();
      showMessage('success', `A new blog ${blogObject.title} by ${blogObject.author} added`);

      setTitle('');
      setAuthor('');
      setUrl('');
    } catch (error) {
      showMessage('error', error.response.data.error);
    }
  };

  // ###############################
  // Appearance
  // ###############################

  return (
    <div className="formDiv">
      <h2>create a new blog</h2>
      <form onSubmit={addBlog}>
        <div>
          title:
          <input
            id="input-title"
            name="title"
            type="text"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author:
          <input
            id="input-author"
            name="author"
            type="text"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url:
          <input
            id="input-url"
            name="url"
            type="text"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button className="submit-button" type="submit">
          create
        </button>
      </form>
    </div>
  );
};

export default BlogForm;
