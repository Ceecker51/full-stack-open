import { useDispatch } from 'react-redux';
import { useField } from '../hooks';

import { commentBlog } from '../reducers/blogReducer';

const CommentForm = ({ blog }) => {
  const dispatch = useDispatch();
  const { reset: resetText, ...text } = useField('text');

  const addComment = (event) => {
    event.preventDefault();

    dispatch(commentBlog(blog, { text }));

    resetText();
  };

  return (
    <form onSubmit={addComment}>
      <input {...text} />
      <button type="submit">add comment</button>
    </form>
  );
};

export default CommentForm;
