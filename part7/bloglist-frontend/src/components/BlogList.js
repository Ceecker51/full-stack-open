import { useSelector } from 'react-redux';
import { ListGroup } from 'react-bootstrap';

import Blog from './Blog';

const BlogList = () => {
  const blogs = useSelector((state) => state.blogs);

  if (!blogs) {
    return null;
  }

  return (
    <ListGroup style={{ marginTop: 10 }}>
      {blogs.map((blog) => (
        <ListGroup.Item key={blog.id}>
          <Blog blog={blog} />
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default BlogList;
