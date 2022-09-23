import PropTypes from 'prop-types';

import { useField } from '../hooks';

const BlogForm = ({ createBlog }) => {
  const { reset: resetTitle, ...title } = useField('text');
  const { reset: resetAuthor, ...author } = useField('text');
  const { reset: resetUrl, ...url } = useField('text');

  const addBlog = (event) => {
    event.preventDefault();

    createBlog({ title: title.value, author: author.value, url: url.value });

    resetTitle();
    resetAuthor();
    resetUrl();
  };

  return (
    <div className="formDiv">
      <h2>create a new blog</h2>
      <form onSubmit={addBlog}>
        <div>
          title:
          <input {...title} />
        </div>
        <div>
          author:
          <input {...author} />
        </div>
        <div>
          url:
          <input {...url} />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  );
};

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired,
};

export default BlogForm;
