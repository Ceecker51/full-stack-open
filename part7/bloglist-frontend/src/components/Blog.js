import { useState } from 'react';

const Blog = ({ user, blog, addLike, removeBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  const [detailsVisible, setDetailsVisible] = useState(false);

  const toggleDetailsVisibility = () => {
    setDetailsVisible(!detailsVisible);
  };

  const showDeleteButton = () => {
    return <button onClick={removeBlog}>remove</button>;
  };

  const showDetails = () => {
    return (
      <div className="blog-details">
        <div>{blog.url}</div>
        <div>
          likes {blog.likes}
          <button onClick={addLike}>like</button>
        </div>
        <div>{blog.author}</div>
        {user.username === blog.user.username ? showDeleteButton() : null}
      </div>
    );
  };

  return (
    <div className="blog" style={blogStyle}>
      {blog.title} {blog.author}
      <button onClick={toggleDetailsVisibility}>{detailsVisible ? 'hide' : 'view'}</button>
      {detailsVisible ? showDetails() : null}
    </div>
  );
};

export default Blog;
