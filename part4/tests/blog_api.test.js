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
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const blogs = await Blog.find({});

  const blogsAtEnd = blogs.map((blog) => blog.toJSON());
  expect(blogsAtEnd).toHaveLength(testHelper.initialBlogs.length + 1);

  const titles = blogsAtEnd.map((blog) => blog.title);
  expect(titles).toContain('Learning JavaScript Design Patterns');
});

afterAll(() => {
  mongoose.connection.close();
});
