import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import Blog from './Blog';

test('Blog renders the blogs title and author by default', () => {
  const blog = {
    title: 'TestTitle',
    author: 'TestAuthor',
    url: 'http://www.test-url.de',
    likes: 2,
  };

  const { container } = render(<Blog blog={blog} />);
  const div = container.querySelector('.blog');
  const details = container.querySelector('.blog-details');

  expect(div).toHaveTextContent('TestTitle TestAuthor');
  expect(details).not.toBeInTheDocument();
});
