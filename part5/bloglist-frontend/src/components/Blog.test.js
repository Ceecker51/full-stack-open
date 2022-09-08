import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

test('Blog renders details when view button is clicked', async () => {
  const blog = {
    title: 'TestTitle',
    author: 'TestAuthor',
    url: 'http://www.test-url.de',
    likes: 2,
    user: {
      username: 'TestUser',
    },
  };

  const user = {
    username: 'TestUser',
  };

  const mockHandler = jest.fn();

  const { container } = render(<Blog blog={blog} user={user} />);

  const userAction = userEvent.setup();
  const button = screen.getByText('view');
  button.onclick = mockHandler;
  await userAction.click(button);

  expect(mockHandler.mock.calls).toHaveLength(1);

  const details = container.querySelector('.blog-details');
  expect(details).toBeInTheDocument();
});
