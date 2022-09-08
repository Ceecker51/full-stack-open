import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import BlogForm from './BlogForm';

test('<BlogForm /> ', async () => {
  const createBlog = jest.fn();
  const user = userEvent.setup();

  const { container } = render(<BlogForm createBlog={createBlog} />);

  const txtTitle = container.querySelector('#input-title');
  const txtAuthor = container.querySelector('#input-author');
  const txtUrl = container.querySelector('#input-url');
  const btnSubmit = screen.getByText('create');

  await user.type(txtTitle, 'TestTitle');
  await user.type(txtAuthor, 'TestAuthor');
  await user.type(txtUrl, 'TestUrl');
  await user.click(btnSubmit);

  expect(createBlog.mock.calls).toHaveLength(1);
  expect(createBlog.mock.calls[0][0].title).toBe('TestTitle');
  expect(createBlog.mock.calls[0][0].author).toBe('TestAuthor');
  expect(createBlog.mock.calls[0][0].url).toBe('TestUrl');
});
