import { useDispatch, useSelector } from 'react-redux';
import { likeBlog, deleteBlog } from '../reducers/blogReducer';

import CommentForm from './CommentForm';

const BlogDetails = ({ blog }) => {
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.authUser);

  const handleLike = () => {
    dispatch(likeBlog(blog));
  };

  const removeBlog = () => {
    const result = window.confirm(`Remove blog ${blog.title} by ${blog.author}`);
    if (!result) {
      return;
    }

    dispatch(deleteBlog(blog));
  };

  if (!blog) {
    return null;
  }

  const showRemoveButton = () => {
    return authUser.username === blog.user.username ? (
      <button onClick={removeBlog}>remove</button>
    ) : null;
  };

  return (
    <div className="blog-details">
      <h2>
        {blog.title} {blog.author}
      </h2>
      <div>
        <a href={blog.url}>{blog.url}</a>
      </div>
      <div>
        {blog.likes} likes
        <button onClick={handleLike}>like</button>
      </div>
      <div>added by {blog.user.name}</div>
      {showRemoveButton()}
      <h2>comments</h2>
      <CommentForm blog={blog} />
      <ul>
        {blog.comments.map((comment) => (
          <li key={comment.id}>{comment.text}</li>
        ))}
      </ul>
    </div>
  );
};

export default BlogDetails;
