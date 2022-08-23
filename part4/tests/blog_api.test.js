const mongoose = require('mongoose');
const supertest = require('supertest');

const testHelper = require('./test_helper');
const app = require('../app');
const api = supertest(app); // Wrap application into a superagent object

const Blog = require('../models/blog');

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogObjects = testHelper.initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

// #############################
// Formatting
// #############################

test('verify unique idenfitifier format', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);

  const blog = response.body[0];
  expect(blog.id).toBeDefined();
});

// #############################
// GET /api/blogs
// #############################

test('all notes are returned as json', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);

  const titles = response.body.map((r) => r.title);

  expect(titles).toHaveLength(testHelper.initialBlogs.length);
  expect(titles).toContain('TDD harms architecture');
}, 100000);

// #############################
// POST /api/blogs
// #############################

test('a blog post can be added', async () => {
  const newBlog = {
    title: 'Learning JavaScript Design Patterns',
    author: 'Addy Osmani',
    url: 'https://www.patterns.dev/posts/classic-design-patterns/',
    likes: 5,
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const blogsAtEnd = await testHelper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(testHelper.initialBlogs.length + 1);

  const titles = blogsAtEnd.map((blog) => blog.title);
  expect(titles).toContain('Learning JavaScript Design Patterns');
});

test('blog post without likes property is set to zero', async () => {
  const newBlog = {
    title: 'Learning JavaScript Design Patterns',
    author: 'Addy Osmani',
    url: 'https://www.patterns.dev/posts/classic-design-patterns/',
  };

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const blog = response.body;

  expect(blog.likes).toBeDefined();
  expect(blog.likes).toBe(0);
});

test('blog without title and url properties is not added', async () => {
  const newBlog = {
    author: 'Addy Osmani',
  };

  await api.post('/api/blogs').send(newBlog).expect(400);

  const blogsAtEnd = await testHelper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(testHelper.initialBlogs.length);
});

// #############################
// DELETE /api/blogs/:id
// #############################

test('succeeds with status code 204 if id is valid', async () => {
  const blogAtStart = await testHelper.blogsInDb();
  const blogToDelete = blogAtStart[0];

  await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

  const blogsAtEnd = await testHelper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(testHelper.initialBlogs.length - 1);

  const titles = blogsAtEnd.map((blog) => blog.title);
  expect(titles).not.toContain(blogToDelete.title);
});

test('fails with status code 404 if id is invalid', async () => {
  const invalidId = '5a3d5da59070081a82a3445';

  await api.delete(`/api/blogs/${invalidId}`).expect(404);
});

afterAll(() => {
  mongoose.connection.close();
});
