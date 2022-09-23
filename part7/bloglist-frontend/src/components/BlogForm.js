import PropTypes from 'prop-types';
import { Form, Button } from 'react-bootstrap';

import { useField } from '../hooks';

const BlogForm = ({ createBlog, resetBlog }) => {
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

  const cancel = (event) => {
    event.preventDefault();

    resetBlog();

    resetTitle();
    resetAuthor();
    resetUrl();
  };

  return (
    <div className="formDiv">
      <h2>create new blog</h2>
      <Form onSubmit={addBlog} onReset={cancel}>
        <Form.Group>
          <Form.Label>Title</Form.Label>
          <Form.Control {...title} />
          <Form.Label>Author</Form.Label>
          <Form.Control {...author} />
          <Form.Label>Url</Form.Label>
          <Form.Control {...url} />
        </Form.Group>
        <Button style={{ marginTop: 10 }} variant="primary" type="submit">
          create
        </Button>
        <Button style={{ marginTop: 10, marginLeft: 5 }} variant="danger" type="reset">
          reset
        </Button>
      </Form>
    </div>
  );
};

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired,
};

export default BlogForm;
