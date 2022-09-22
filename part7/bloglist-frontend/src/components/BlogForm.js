import { useState } from 'react';
import PropTypes from 'prop-types';

const BlogForm = ({ createBlog }) => {
  // ###############################
  // State
  // ###############################

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  // ###############################
  // Actions
  // ###############################

  const addBlog = (event) => {
    event.preventDefault();

    createBlog({
      title,
      author,
      url,
    });

    setTitle('');
    setAuthor('');
    setUrl('');
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

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired,
};

export default BlogForm;
